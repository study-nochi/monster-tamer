import { Scene } from "phaser";
import { BATTLE_ASSET_KEYS, MONSTER_ASSET_KEYS } from "../constants/asset";
import { SCENE_KEY } from "../constants/scene";
import { BattleMenu } from "../battle/ui/menu/battle-menu";
import { BATTLE_PLAYER_INPUT } from "../battle/ui/menu/battle-menu-options";
import { DIRECTION } from "../constants/direction";
import { Background } from "../battle/background";
import { HealthBar } from "../battle/ui/health-bar";
import { EnemyBattleMonster } from "../battle/monsters/enemy-bettle-monster";
import { PlayerBattleMonster } from "../battle/monsters/player-battle-monster";

export class Battle extends Scene {
  #battleMenu: BattleMenu;
  #cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  #activeEnemyMonster: EnemyBattleMonster;
  #activePlayerMonster: PlayerBattleMonster;
  #activePlayerAttackIndex: number;

  constructor() {
    super({
      key: SCENE_KEY.BATTLE_SCENE,
      active: true,
    });
  }

  init() {
    console.log(`[${Battle.name}:init] invoked`);
    this.#activePlayerAttackIndex = -1;
  }

  preload() {
    console.log(`[${Battle.name}:preload] invoked`);
  }

  create() {
    console.log(`[${Battle.name}:create] invoked`);
    // created main background
    const background = new Background(this);
    background.showForest();

    // render out the player and enemy monsters
    this.#activeEnemyMonster = new EnemyBattleMonster({
      _scene: this,
      _monsterDetails: {
        name: MONSTER_ASSET_KEYS.CARNODUSK,
        assetKey: MONSTER_ASSET_KEYS.CARNODUSK,
        maxHp: 25,
        assetFrame: 0,
        currentHp: 25,
        baseAttack: 5,
        currentLevel: 5,
        attackIds: [1],
      },
    });

    this.#activePlayerMonster = new PlayerBattleMonster({
      _scene: this,
      _monsterDetails: {
        name: MONSTER_ASSET_KEYS.IGUANIGNITE,
        assetKey: MONSTER_ASSET_KEYS.IGUANIGNITE,
        maxHp: 25,
        assetFrame: 0,
        currentHp: 25,
        baseAttack: 5,
        currentLevel: 5,
        attackIds: [2, 1],
      },
    });

    // render out the main and sub info panes
    this.#battleMenu = new BattleMenu(this, this.#activePlayerMonster);
    this.#battleMenu.showMainBattleMenu();

    this.#cursorKeys = this.input.keyboard!.createCursorKeys();
  }

  update() {
    const wasSpaceKeyPressed = Phaser.Input.Keyboard.JustDown(
      this.#cursorKeys.space
    );

    if (wasSpaceKeyPressed) {
      this.#battleMenu.handlePlayerInput(BATTLE_PLAYER_INPUT.OK);

      // check if the player selected an attack, and update display text
      if (this.#battleMenu.selectedAttack === undefined) {
        return;
      }

      this.#activePlayerAttackIndex = this.#battleMenu.selectedAttack;

      if (!this.#activePlayerMonster.attacks[this.#activePlayerAttackIndex]) {
        return;
      }

      console.log(
        `Player selected the following move: ${this.#battleMenu.selectedAttack}`
      );

      this.#battleMenu.hideMonsterAttackSubMenu();
      this.#handleBattleSequence();
    }

    if (Phaser.Input.Keyboard.JustDown(this.#cursorKeys.shift)) {
      this.#battleMenu.handlePlayerInput(BATTLE_PLAYER_INPUT.CANCEL);
      return;
    }

    let selectedDirection: DIRECTION = DIRECTION.NONE;
    if (this.#cursorKeys.left.isDown) {
      selectedDirection = DIRECTION.LEFT;
    } else if (this.#cursorKeys.right.isDown) {
      selectedDirection = DIRECTION.RIGHT;
    } else if (this.#cursorKeys.up.isDown) {
      selectedDirection = DIRECTION.UP;
    } else if (this.#cursorKeys.down.isDown) {
      selectedDirection = DIRECTION.DOWN;
    }

    if (selectedDirection !== DIRECTION.NONE) {
      this.#battleMenu.handlePlayerInput(selectedDirection);
    }
  }

  #handleBattleSequence() {
    // greneral battle sequence
    // show attack used, brief pause
    // then play attack animation, brief pause
    // then play health bar animation, brief pause
    // then repeat the steps above for the enemy monster

    this.#playerAttack();
  }

  #playerAttack() {
    this.#battleMenu.updateInfoPaneMessagesAndWaifForInput(
      [
        `${this.#activePlayerMonster.name} used ${
          this.#activePlayerMonster.attacks[this.#activePlayerAttackIndex].name
        }`,
      ],
      () => {
        this.time.delayedCall(500, () => {
          this.#activeEnemyMonster.takeDamage(20, () => {
            this.#enemyAttack();
          });
        });
      }
    );
  }

  #enemyAttack() {
    this.#battleMenu.updateInfoPaneMessagesAndWaifForInput(
      [
        `${this.#activeEnemyMonster.name} used ${
          this.#activeEnemyMonster.attacks[0].name
        }`,
      ],
      () => {
        this.time.delayedCall(500, () => {
          this.#activePlayerMonster.takeDamage(20, () => {
            this.#battleMenu.showMainBattleMenu();
          });
        });
      }
    );
  }
}
