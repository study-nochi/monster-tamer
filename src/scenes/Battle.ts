import { Scene } from "phaser";
import { MONSTER_ASSET_KEYS } from "../constants/asset";
import { SCENE_KEYS } from "../constants/scene";
import { BattleMenu } from "../battle/ui/menu/battle-menu";
import { BATTLE_PLAYER_INPUT } from "../battle/ui/menu/battle-menu-options";
import { DIRECTION } from "../constants/direction";
import { Background } from "../battle/background";
import { EnemyBattleMonster } from "../battle/monsters/enemy-bettle-monster";
import { PlayerBattleMonster } from "../battle/monsters/player-battle-monster";
import { StateMachine } from "../utils/state-machine";
import { BATTLE_STATES } from "../constants/battle";
import { SKIP_BATTLE_ANIMATION } from "../constants/config";

export class Battle extends Scene {
  #battleMenu: BattleMenu;
  #cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  #activeEnemyMonster: EnemyBattleMonster;
  #activePlayerMonster: PlayerBattleMonster;
  #activePlayerAttackIndex: number;
  #battleStateMachine: StateMachine;

  constructor() {
    super({
      key: SCENE_KEYS.BATTLE_SCENE,
      active: true,
    });
  }

  init() {
    console.log(`[${Battle.name}:init] invoked`);
    this.#activePlayerAttackIndex = -1;
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
      skipBattleAnimation: SKIP_BATTLE_ANIMATION,
    });

    this.#activePlayerMonster = new PlayerBattleMonster({
      _scene: this,
      _monsterDetails: {
        name: MONSTER_ASSET_KEYS.IGUANIGNITE,
        assetKey: MONSTER_ASSET_KEYS.IGUANIGNITE,
        maxHp: 25,
        assetFrame: 0,
        currentHp: 25,
        baseAttack: 15,
        currentLevel: 5,
        attackIds: [2, 1],
      },
      skipBattleAnimation: SKIP_BATTLE_ANIMATION,
    });

    // render out the main and sub info panes
    this.#battleMenu = new BattleMenu(this, this.#activePlayerMonster);
    this.#createBattleStateMachine();

    this.#cursorKeys = this.input.keyboard!.createCursorKeys();
  }

  update() {
    this.#battleStateMachine.update();

    const wasSpaceKeyPressed = Phaser.Input.Keyboard.JustDown(
      this.#cursorKeys.space
    );
    // limit input based on the current battle state we are in
    // if we are not in the right battle state, return early and do not process input
    if (
      wasSpaceKeyPressed &&
      (this.#battleStateMachine.currentStateName ===
        BATTLE_STATES.PRE_BATTLE_INFO ||
        this.#battleStateMachine.currentStateName ===
          BATTLE_STATES.POST_ATTACK_CHECK ||
        this.#battleStateMachine.currentStateName ===
          BATTLE_STATES.FLEE_ATTEMPT)
    ) {
      this.#battleMenu.handlePlayerInput(BATTLE_PLAYER_INPUT.OK);
      return;
    }

    if (
      this.#battleStateMachine.currentStateName !== BATTLE_STATES.PLAYER_INPUT
    ) {
      return;
    }

    if (wasSpaceKeyPressed) {
      this.#battleMenu.handlePlayerInput(BATTLE_PLAYER_INPUT.OK);

      //check if the player selected an attack, and update display text
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
      this.#battleStateMachine.setState(BATTLE_STATES.ENEMY_INPUT);
    }

    if (Phaser.Input.Keyboard.JustDown(this.#cursorKeys.shift)) {
      this.#battleMenu.handlePlayerInput(BATTLE_PLAYER_INPUT.CANCEL);
      return;
    }

    /** @type {import('../common/direction.js').Direction} */
    let selectedDirection = DIRECTION.NONE;
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

  #playerAttack() {
    this.#battleMenu.updateInfoPaneMessageNoInputRequired(
      `${this.#activePlayerMonster.name} used ${
        this.#activePlayerMonster.attacks[this.#activePlayerAttackIndex].name
      }`,
      () => {
        this.time.delayedCall(500, () => {
          this.#activeEnemyMonster.playTakeDamageAnimation(() => {
            this.#activeEnemyMonster.takeDamage(
              this.#activePlayerMonster.baseAttack,
              () => {
                this.#enemyAttack();
              }
            );
          });
        });
      },
      SKIP_BATTLE_ANIMATION
    );
  }

  #enemyAttack() {
    if (this.#activeEnemyMonster.isFainted) {
      this.#battleStateMachine.setState(BATTLE_STATES.POST_ATTACK_CHECK);
      return;
    }

    this.#battleMenu.updateInfoPaneMessageNoInputRequired(
      `foe ${this.#activeEnemyMonster.name} used ${
        this.#activeEnemyMonster.attacks[0].name
      }`,
      () => {
        this.time.delayedCall(500, () => {
          this.#activePlayerMonster.playTakeDamageAnimation(() => {
            this.#activePlayerMonster.takeDamage(
              this.#activeEnemyMonster.baseAttack,
              () => {
                this.#battleStateMachine.setState(
                  BATTLE_STATES.POST_ATTACK_CHECK
                );
              }
            );
          });
        });
      },
      SKIP_BATTLE_ANIMATION
    );
  }

  #postBattleSequenceCheck() {
    if (this.#activeEnemyMonster.isFainted) {
      this.#activeEnemyMonster.playDeathAnimation(() => {
        this.#battleMenu.updateInfoPaneMessagesAndWaitForInput(
          [
            `Wild ${this.#activeEnemyMonster.name} fainted`,
            "You have gained some experience",
          ],
          () => {
            this.#battleStateMachine.setState(BATTLE_STATES.FINISHED);
          },
          SKIP_BATTLE_ANIMATION
        );
      });
      return;
    }

    if (this.#activePlayerMonster.isFainted) {
      this.#activePlayerMonster.playDeathAnimation(() => {
        this.#battleMenu.updateInfoPaneMessagesAndWaitForInput(
          [
            `${this.#activePlayerMonster.name} fainted`,
            "You have no more monsters, escaping to safety...",
          ],
          () => {
            this.#battleStateMachine.setState(BATTLE_STATES.FINISHED);
          },
          SKIP_BATTLE_ANIMATION
        );
      });
      return;
    }

    this.#battleStateMachine.setState(BATTLE_STATES.PLAYER_INPUT);
  }

  #transitionToNextScene() {
    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      () => {
        this.scene.start(SCENE_KEYS.BATTLE_SCENE);
      }
    );
  }

  #createBattleStateMachine() {
    this.#battleStateMachine = new StateMachine("battle", this);

    this.#battleStateMachine.addState({
      name: BATTLE_STATES.INTRO,
      onEnter: () => {
        // wait for any scene setup and transitions to complete
        this.time.delayedCall(500, () => {
          this.#battleStateMachine.setState(BATTLE_STATES.PRE_BATTLE_INFO);
        });
      },
    });

    this.#battleStateMachine.addState({
      name: BATTLE_STATES.PRE_BATTLE_INFO,
      onEnter: () => {
        // wait for enemy monster to appear on the screen and notify player about the wild monster
        this.#activeEnemyMonster.playMonsterAppearAnimation(() => undefined);
        this.#activeEnemyMonster.playMonsterHealthBarAppearAnimation(() => {
          this.#battleMenu.updateInfoPaneMessagesAndWaitForInput(
            [`wild ${this.#activeEnemyMonster.name} appeared!`],
            () => {
              // wait for text animation to complete and move to next state
              this.time.delayedCall(500, () => {
                this.#battleStateMachine.setState(
                  BATTLE_STATES.BRING_OUT_MONSTER
                );
              });
            },
            SKIP_BATTLE_ANIMATION
          );
        });
      },
    });

    this.#battleStateMachine.addState({
      name: BATTLE_STATES.BRING_OUT_MONSTER,
      onEnter: () => {
        // wait for player monster to appear on the screen and notify the player about monster
        this.#activePlayerMonster.playMonsterAppearAnimation(() => {
          this.#activePlayerMonster.playMonsterHealthBarAppearAnimation(
            () => undefined
          );
          this.#battleMenu.updateInfoPaneMessageNoInputRequired(
            `go ${this.#activePlayerMonster.name}!`,
            () => {
              // wait for text animation to complete and move to next state
              this.time.delayedCall(1200, () => {
                this.#battleStateMachine.setState(BATTLE_STATES.PLAYER_INPUT);
              });
            },
            SKIP_BATTLE_ANIMATION
          );
        });
      },
    });

    this.#battleStateMachine.addState({
      name: BATTLE_STATES.PLAYER_INPUT,
      onEnter: () => {
        this.#battleMenu.showMainBattleMenu();
      },
    });

    this.#battleStateMachine.addState({
      name: BATTLE_STATES.ENEMY_INPUT,
      onEnter: () => {
        // TODO: add feature in a future update
        // pick a random move for the enemy monster, and in the future implement some type of AI behavior
        this.#battleStateMachine.setState(BATTLE_STATES.BATTLE);
      },
    });

    this.#battleStateMachine.addState({
      name: BATTLE_STATES.BATTLE,
      onEnter: () => {
        // general battle flow
        // show attack used, brief pause
        // then play attack animation, brief pause
        // then play damage animation, brief pause
        // then play health bar animation, brief pause
        // then repeat the steps above for the other monster

        this.#playerAttack();
      },
    });

    this.#battleStateMachine.addState({
      name: BATTLE_STATES.POST_ATTACK_CHECK,
      onEnter: () => {
        this.#postBattleSequenceCheck();
      },
    });

    this.#battleStateMachine.addState({
      name: BATTLE_STATES.FINISHED,
      onEnter: () => {
        this.#transitionToNextScene();
      },
    });

    this.#battleStateMachine.addState({
      name: BATTLE_STATES.FLEE_ATTEMPT,
      onEnter: () => {
        this.#battleMenu.updateInfoPaneMessagesAndWaitForInput(
          [`You got away safely!`],
          () => {
            this.#battleStateMachine.setState(BATTLE_STATES.FINISHED);
          },
          SKIP_BATTLE_ANIMATION
        );
      },
    });

    // start the state machine
    this.#battleStateMachine.setState("INTRO");
  }
}
