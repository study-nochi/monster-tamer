import { Scene } from "phaser";
import {
  BATTLE_ASSET_KEYS,
  BATTLE_BACKGROUND_ASSET_KEYS,
  HEALTH_BAR_ASSET_KEYS,
  MONSTER_ASSET_KEYS,
} from "../constants/asset";
import { SCENE_KEY } from "../constants/scene";
import { BattleMenu } from "../battle/ui/menu/battle-menu";
import { BATTLE_PLAYER_INPUT } from "../battle/ui/menu/battle-menu-options";
import { DIRECTION } from "../constants/direction";
import { Background } from "../battle/background";
import { HealthBar } from "../battle/ui/health-bar";
import { BattleMonster } from "../battle/monsters/battle-monster";

export class Battle extends Scene {
  #battleMenu: BattleMenu;
  #cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  #activeEnemyMonster: BattleMonster;

  constructor() {
    super({
      key: SCENE_KEY.BATTLE_SCENE,
      active: true,
    });
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
    this.#activeEnemyMonster = new BattleMonster(
      {
        scene: this,
        monsterDetails: {
          name: MONSTER_ASSET_KEYS.CARNODUSK,
          assetKey: MONSTER_ASSET_KEYS.CARNODUSK,
          maxHp: 25,
          assetFrame: 0,
          currentHp: 25,
          baseAttack: 5,
          attackIds: ["TACKLE", "SCRATCH", "BITE"],
        },
      },
      { x: 768, y: 144 }
    );
    this.add.image(768, 144, MONSTER_ASSET_KEYS.CARNODUSK, 0);
    this.add.image(256, 316, MONSTER_ASSET_KEYS.IGUANIGNITE, 0).setFlipX(true);

    // render out the health bars
    const playerMonsterName = this.add.text(
      30,
      20,
      MONSTER_ASSET_KEYS.IGUANIGNITE,
      {
        color: "#7E3D3F",
        fontSize: "32px",
      }
    );
    const playerHealthBar = new HealthBar(this, 34, 34);
    this.add.container(556, 318, [
      this.add
        .image(0, 0, BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND)
        .setOrigin(0),
      playerMonsterName,
      playerHealthBar.container,
      this.add.text(playerMonsterName.width + 35, 23, "L5", {
        color: "#ED474B",
        fontSize: "28px",
      }),
      this.add.text(30, 55, "HP", {
        color: "#FF6505",
        fontSize: "24px",
        fontStyle: "italic",
      }),
      this.add
        .text(443, 80, "25/25", {
          color: "#7E3D3F",
          fontSize: "16px",
        })
        .setOrigin(1, 0),
    ]);

    // render out the enemy health bars
    const enemyMonsterName = this.add.text(
      30,
      20,
      MONSTER_ASSET_KEYS.CARNODUSK,
      {
        color: "#7E3D3F",
        fontSize: "32px",
      }
    );
    const enemyHealthBar = this.#activeEnemyMonster._healthBar;
    this.add.container(0, 0, [
      this.add
        .image(0, 0, BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND)
        .setOrigin(0)
        .setScale(1, 0.8),
      enemyMonsterName,
      enemyHealthBar.container,
      this.add.text(enemyMonsterName.width + 35, 23, "L5", {
        color: "#ED474B",
        fontSize: "28px",
      }),
      this.add.text(30, 55, "HP", {
        color: "#FF6505",
        fontSize: "24px",
        fontStyle: "italic",
      }),
      this.add.text(443, 80, "25/25", {
        color: "#7E3D3F",
        fontSize: "16px",
      }),
    ]);

    // render out the main and sub info panes
    this.#battleMenu = new BattleMenu(this);
    this.#battleMenu.showMainBattleMenu();

    this.#cursorKeys = this.input.keyboard!.createCursorKeys();
    // this.#cursorKeys.down;
    playerHealthBar.setMeterPercentageAnimated(0.5, {
      duration: 1500,
      callback: () => {
        console.log("animation completed!");
      },
    });
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
      console.log(
        `Player selected the following move: ${this.#battleMenu.selectedAttack}`
      );
      this.#battleMenu.hideMonsterAttackSubMenu();
      this.#battleMenu.updateInfoPaneMessagesAndWaifForInput(
        ["Your monster attacks the enemy!"],
        () => {
          this.#battleMenu.showMonsterAttackSubMenu();
        }
      );
      return;
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
}
