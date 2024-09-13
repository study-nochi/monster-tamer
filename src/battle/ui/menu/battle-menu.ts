import { UI_ASSET_KEYS } from "../../../constants/asset";
import { SKIP_BATTLE_ANIMATION } from "../../../constants/config";
import { DIRECTION } from "../../../constants/direction";
import { exhaustiveGuard } from "../../../utils/guard";
import { animateText } from "../../../utils/test-utils";
import { BattleMonster } from "../../monsters/battle-monster";
import { BATTLE_UI_TEXT_STYLE } from "./battle-menu-config";
import {
  ACTIVE_BATTLE_MENU,
  ATTACK_MENU_CURSOR,
  ATTACK_MOVE_OPTIONS,
  BATTLE_MENU_CURSOR_POSITIONS,
  BATTLE_MENU_OPTIONS,
  BATTLE_PLAYER_INPUT,
  DISTANCE_TO_MOVE_CURSOR,
  PLAYER_INPUT_CURSOR_POS,
} from "./battle-menu-options";

export class BattleMenu {
  #scene;
  #mainBattleMenuPhaserContainerGameObject: Phaser.GameObjects.Container;
  #moveSelectionSubBattleMenuPhaserContainerGameObject: Phaser.GameObjects.Container;
  #battleTextGameObjectLine1: Phaser.GameObjects.Text;
  #battleTextGameObjectLine2: Phaser.GameObjects.Text;
  #mainBattleMenuCursorPhaserImageGameObject: Phaser.GameObjects.Image;
  #attackBattleMenuCursorPhaserImageGameObject: Phaser.GameObjects.Image;
  #selectedBattleMenuOption: BATTLE_MENU_OPTIONS;
  #selectedAttackMenuOption: ATTACK_MOVE_OPTIONS;
  #activeBattleMenu: ACTIVE_BATTLE_MENU;
  #queuedInfoPanelMessages: string[];
  #queuedInfoPanelCallback: (() => void) | undefined;
  #waitingForPlayerInput: boolean;
  #selectedAttackIndex?: number;
  #activePlayerMonster: BattleMonster;
  #userInputCursorPhaserImageGameObject: Phaser.GameObjects.Image;
  #userInputCursorPhaserTween: Phaser.Tweens.Tween;
  #queuedMessagesSkipAnimation: boolean;
  #queuedMessageAnimationPlaying: boolean;

  constructor(scene: Phaser.Scene, activePlayerMonster: BattleMonster) {
    this.#scene = scene;
    this.#activePlayerMonster = activePlayerMonster;
    this.#activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_MAIN;
    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
    this.#selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_1;
    this.#queuedInfoPanelCallback = undefined;
    this.#queuedInfoPanelMessages = [];
    this.#waitingForPlayerInput = false;

    this.#selectedAttackIndex = undefined;
    this.#queuedMessagesSkipAnimation = false;
    this.#queuedMessageAnimationPlaying = false;
    this.#createMainInfoPane();
    this.#createMainBattleMenu();
    this.#createMonsterAttackSubMenu();
    this.#createPlayerInputCursor();
  }

  get selectedAttack() {
    if (this.#activeBattleMenu === ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT) {
      return this.#selectedAttackIndex;
    }
    return undefined;
  }

  showMainBattleMenu() {
    this.#activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_MAIN;
    this.#battleTextGameObjectLine1.setText("what should");
    this.#mainBattleMenuPhaserContainerGameObject.setAlpha(1);
    this.#battleTextGameObjectLine1.setAlpha(1);
    this.#battleTextGameObjectLine2.setAlpha(1);

    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
    this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(
      BATTLE_MENU_CURSOR_POSITIONS.x,
      BATTLE_MENU_CURSOR_POSITIONS.y
    );
    this.#selectedAttackIndex = undefined;
  }

  hideMainBattleMenu() {
    this.#mainBattleMenuPhaserContainerGameObject.setAlpha(0);
    this.#battleTextGameObjectLine1.setAlpha(0);
    this.#battleTextGameObjectLine2.setAlpha(0);
  }

  showMonsterAttackSubMenu() {
    this.#activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT;
    this.#moveSelectionSubBattleMenuPhaserContainerGameObject.setAlpha(1);
  }

  hideMonsterAttackSubMenu() {
    this.#activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_MAIN;
    this.#moveSelectionSubBattleMenuPhaserContainerGameObject.setAlpha(0);
  }

  playInputCursorAnimation() {
    this.#userInputCursorPhaserImageGameObject.setPosition(
      this.#battleTextGameObjectLine1.displayWidth +
        this.#userInputCursorPhaserImageGameObject.displayWidth * 2.7,
      this.#userInputCursorPhaserImageGameObject.y
    );
    this.#userInputCursorPhaserImageGameObject.setAlpha(1);
    this.#userInputCursorPhaserTween.restart();
  }

  hideInputCursor() {
    this.#userInputCursorPhaserImageGameObject.setAlpha(0);
    this.#userInputCursorPhaserTween.pause();
  }

  handlePlayerInput(input: BATTLE_PLAYER_INPUT | DIRECTION) {
    if (this.#queuedMessageAnimationPlaying && input === "OK") {
      return;
    }

    if (this.#waitingForPlayerInput && (input === "CANCEL" || input === "OK")) {
      this.#updateInfoPaneWithMessage();
      return;
    }

    if (input === "CANCEL") {
      this.#switchToMainBattleMenu();
      return;
    }
    if (input === "OK") {
      if (this.#activeBattleMenu === ACTIVE_BATTLE_MENU.BATTLE_MAIN) {
        this.#handlePlayerChooseMainBattleOption();
        return;
      }
      if (this.#activeBattleMenu === ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT) {
        this.#handlePlayerChooseAttack();
        return;
      }
      return;
    }
    this.#updateSelectedBattleMenuOptionFromInput(input);
    this.#updateSelectedMoveMenuOptionFromInput(input);
    this.#moveMainBattleMenuCursor();
    this.#moveMoveSelectBattleMenuCursor();
  }

  updateInfoPaneMessageNoInputRequired(
    message: string,
    callback?: () => void,
    skipAnimation: boolean = false
  ) {
    this.#battleTextGameObjectLine1.setText("").setAlpha(1);

    if (skipAnimation) {
      this.#battleTextGameObjectLine1.setText(message);
      this.#waitingForPlayerInput = false;
      if (callback) {
        callback();
      }
      return;
    }

    animateText(this.#scene, this.#battleTextGameObjectLine1, message, {
      delay: 50,
      callback: () => {
        this.#waitingForPlayerInput = false;
        if (callback) {
          callback();
        }
      },
    });
  }

  updateInfoPaneMessagesAndWaitForInput(
    messages: string[],
    callback?: () => void,
    skipAnimation = false
  ) {
    this.#queuedInfoPanelMessages = messages;
    this.#queuedInfoPanelCallback = callback;
    this.#queuedMessagesSkipAnimation = skipAnimation;

    this.#updateInfoPaneWithMessage();
  }

  #updateInfoPaneWithMessage() {
    this.#waitingForPlayerInput = false;
    this.#battleTextGameObjectLine1.setText("").setAlpha(1);
    this.hideInputCursor();

    // check if all messages have been displayed from the queue and call the callback
    if (this.#queuedInfoPanelMessages.length === 0) {
      if (this.#queuedInfoPanelCallback) {
        this.#queuedInfoPanelCallback();
        this.#queuedInfoPanelCallback = undefined;
      }
      return;
    }

    // get first message from queue and animate message
    const messageToDisplay = this.#queuedInfoPanelMessages.shift() ?? "";

    if (this.#queuedMessagesSkipAnimation) {
      this.#battleTextGameObjectLine1.setText(messageToDisplay);
      this.#queuedMessageAnimationPlaying = false;
      this.#waitingForPlayerInput = true;
      this.playInputCursorAnimation();
    
      return;
    }

    this.#queuedMessageAnimationPlaying = true;
    animateText(
      this.#scene,
      this.#battleTextGameObjectLine1,
      messageToDisplay,
      {
        delay: 50,
        callback: () => {
          this.playInputCursorAnimation();
          this.#waitingForPlayerInput = true;
          this.#queuedMessageAnimationPlaying = false;
        },
      }
    );
  }

  // Todo: update to use monster data that is passed into this class instance
  #createMainBattleMenu() {
    this.#battleTextGameObjectLine1 = this.#scene.add.text(
      20,
      468,
      "what should",
      BATTLE_UI_TEXT_STYLE
    );
    this.#battleTextGameObjectLine2 = this.#scene.add.text(
      20,
      512,
      `${this.#activePlayerMonster.name} do next?`,
      BATTLE_UI_TEXT_STYLE
    );

    this.#mainBattleMenuCursorPhaserImageGameObject = this.#scene.add
      .image(
        BATTLE_MENU_CURSOR_POSITIONS.x,
        BATTLE_MENU_CURSOR_POSITIONS.y,
        UI_ASSET_KEYS.CURSOR,
        0
      )
      .setOrigin(0.5)
      .setScale(2.5);

    this.#mainBattleMenuPhaserContainerGameObject = this.#scene.add.container(
      520,
      448,
      [
        this.#createMainInfoSubPane(),
        this.#scene.add.text(
          55,
          22,
          BATTLE_MENU_OPTIONS.FIGHT,
          BATTLE_UI_TEXT_STYLE
        ),
        this.#scene.add.text(
          240,
          22,
          BATTLE_MENU_OPTIONS.SWITCH,
          BATTLE_UI_TEXT_STYLE
        ),
        this.#scene.add.text(
          55,
          70,
          BATTLE_MENU_OPTIONS.ITEM,
          BATTLE_UI_TEXT_STYLE
        ),
        this.#scene.add.text(
          240,
          70,
          BATTLE_MENU_OPTIONS.FLEE,
          BATTLE_UI_TEXT_STYLE
        ),
        this.#mainBattleMenuCursorPhaserImageGameObject,
      ]
    );

    this.hideMainBattleMenu();
  }

  #createMonsterAttackSubMenu() {
    this.#attackBattleMenuCursorPhaserImageGameObject = this.#scene.add
      .image(
        ATTACK_MENU_CURSOR.x,
        ATTACK_MENU_CURSOR.y,
        UI_ASSET_KEYS.CURSOR,
        0
      )
      .setOrigin(0.5)
      .setScale(2.5);

    /** @type {string[]} */
    const attackNames = [];
    for (let i = 0; i < 4; i += 1) {
      attackNames.push(this.#activePlayerMonster.attacks[i]?.name || "-");
    }

    this.#moveSelectionSubBattleMenuPhaserContainerGameObject =
      this.#scene.add.container(0, 448, [
        this.#scene.add.text(55, 22, attackNames[0], BATTLE_UI_TEXT_STYLE),
        this.#scene.add.text(240, 22, attackNames[1], BATTLE_UI_TEXT_STYLE),
        this.#scene.add.text(55, 70, attackNames[2], BATTLE_UI_TEXT_STYLE),
        this.#scene.add.text(240, 70, attackNames[3], BATTLE_UI_TEXT_STYLE),
        this.#attackBattleMenuCursorPhaserImageGameObject,
      ]);
    this.hideMonsterAttackSubMenu();
  }

  #createMainInfoPane() {
    const padding = 4;
    const rectHeight = 124;

    this.#scene.add
      .rectangle(
        padding,
        this.#scene.scale.height - rectHeight - padding,
        this.#scene.scale.width - padding * 2,
        rectHeight,
        0xede4f3,
        1
      )
      .setOrigin(0)
      .setStrokeStyle(8, 0xe4434a, 1);
  }

  #createMainInfoSubPane() {
    const rectWidth = 500;
    const rectHeight = 124;

    return this.#scene.add
      .rectangle(0, 0, rectWidth, rectHeight, 0xede4f3, 1)
      .setOrigin(0)
      .setStrokeStyle(8, 0x905ac2, 1);
  }

  #updateSelectedBattleMenuOptionFromInput(
    direction: BATTLE_PLAYER_INPUT | DIRECTION
  ) {
    if (this.#activeBattleMenu !== ACTIVE_BATTLE_MENU.BATTLE_MAIN) {
      return;
    }

    if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.FIGHT) {
      switch (direction) {
        case DIRECTION.RIGHT:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.SWITCH;
          return;
        case DIRECTION.DOWN:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.ITEM;
          return;
        case DIRECTION.LEFT:
        case DIRECTION.UP:
        case DIRECTION.NONE:
          return;
        default:
          exhaustiveGuard(direction);
      }
      return;
    }

    if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.SWITCH) {
      switch (direction) {
        case DIRECTION.LEFT:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
          return;
        case DIRECTION.DOWN:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FLEE;
          return;
        case DIRECTION.RIGHT:
        case DIRECTION.UP:
        case DIRECTION.NONE:
          return;
        default:
          exhaustiveGuard(direction);
      }
      return;
    }

    if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.ITEM) {
      switch (direction) {
        case DIRECTION.RIGHT:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FLEE;
          return;
        case DIRECTION.UP:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
          return;
        case DIRECTION.LEFT:
        case DIRECTION.DOWN:
        case DIRECTION.NONE:
          return;
        default:
          exhaustiveGuard(direction);
      }
      return;
    }

    if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.FLEE) {
      switch (direction) {
        case DIRECTION.LEFT:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.ITEM;
          return;
        case DIRECTION.UP:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.SWITCH;
          return;
        case DIRECTION.RIGHT:
        case DIRECTION.DOWN:
        case DIRECTION.NONE:
          return;
        default:
          exhaustiveGuard(direction);
      }
      return;
    }

    exhaustiveGuard(this.#selectedBattleMenuOption);
  }

  #moveMainBattleMenuCursor() {
    if (this.#activeBattleMenu !== ACTIVE_BATTLE_MENU.BATTLE_MAIN) {
      return;
    }

    switch (this.#selectedBattleMenuOption) {
      case BATTLE_MENU_OPTIONS.FIGHT:
        this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(
          BATTLE_MENU_CURSOR_POSITIONS.x,
          BATTLE_MENU_CURSOR_POSITIONS.y
        );
        return;
      case BATTLE_MENU_OPTIONS.SWITCH:
        this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(
          228,
          BATTLE_MENU_CURSOR_POSITIONS.y
        );
        return;
      case BATTLE_MENU_OPTIONS.ITEM:
        this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(
          BATTLE_MENU_CURSOR_POSITIONS.x,
          86
        );
        return;
      case BATTLE_MENU_OPTIONS.FLEE:
        this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(228, 86);
        return;
      default:
        exhaustiveGuard(this.#selectedBattleMenuOption);
    }
  }

  #updateSelectedMoveMenuOptionFromInput(direction: DIRECTION) {
    if (this.#activeBattleMenu !== ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT) {
      return;
    }

    if (this.#selectedAttackMenuOption === ATTACK_MOVE_OPTIONS.MOVE_1) {
      switch (direction) {
        case DIRECTION.RIGHT:
          this.#selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_2;
          return;
        case DIRECTION.DOWN:
          this.#selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_3;
          return;
        case DIRECTION.LEFT:
        case DIRECTION.UP:
        case DIRECTION.NONE:
          return;
        default:
          exhaustiveGuard(direction);
      }
      return;
    }

    if (this.#selectedAttackMenuOption === ATTACK_MOVE_OPTIONS.MOVE_2) {
      switch (direction) {
        case DIRECTION.LEFT:
          this.#selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_1;
          return;
        case DIRECTION.DOWN:
          this.#selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_4;
          return;
        case DIRECTION.RIGHT:
        case DIRECTION.UP:
        case DIRECTION.NONE:
          return;
        default:
          exhaustiveGuard(direction);
      }
      return;
    }

    if (this.#selectedAttackMenuOption === ATTACK_MOVE_OPTIONS.MOVE_3) {
      switch (direction) {
        case DIRECTION.RIGHT:
          this.#selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_4;
          return;
        case DIRECTION.UP:
          this.#selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_1;
          return;
        case DIRECTION.LEFT:
        case DIRECTION.DOWN:
        case DIRECTION.NONE:
          return;
        default:
          exhaustiveGuard(direction);
      }
      return;
    }

    if (this.#selectedAttackMenuOption === ATTACK_MOVE_OPTIONS.MOVE_4) {
      switch (direction) {
        case DIRECTION.LEFT:
          this.#selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_3;
          return;
        case DIRECTION.UP:
          this.#selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_2;
          return;
        case DIRECTION.RIGHT:
        case DIRECTION.DOWN:
        case DIRECTION.NONE:
          return;
        default:
          exhaustiveGuard(direction);
      }
      return;
    }

    exhaustiveGuard(this.#selectedAttackMenuOption);
  }

  #moveMoveSelectBattleMenuCursor() {
    if (this.#activeBattleMenu !== ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT) {
      return;
    }

    switch (this.#selectedAttackMenuOption) {
      case ATTACK_MOVE_OPTIONS.MOVE_1:
        this.#attackBattleMenuCursorPhaserImageGameObject.setPosition(
          ATTACK_MENU_CURSOR.x,
          ATTACK_MENU_CURSOR.y
        );
        return;
      case ATTACK_MOVE_OPTIONS.MOVE_2:
        this.#attackBattleMenuCursorPhaserImageGameObject.setPosition(
          ATTACK_MENU_CURSOR.x + DISTANCE_TO_MOVE_CURSOR.right,
          ATTACK_MENU_CURSOR.y
        );
        return;
      case ATTACK_MOVE_OPTIONS.MOVE_3:
        this.#attackBattleMenuCursorPhaserImageGameObject.setPosition(
          ATTACK_MENU_CURSOR.x,
          ATTACK_MENU_CURSOR.y + DISTANCE_TO_MOVE_CURSOR.down
        );
        return;
      case ATTACK_MOVE_OPTIONS.MOVE_4:
        this.#attackBattleMenuCursorPhaserImageGameObject.setPosition(
          ATTACK_MENU_CURSOR.x + DISTANCE_TO_MOVE_CURSOR.right,
          ATTACK_MENU_CURSOR.y + DISTANCE_TO_MOVE_CURSOR.down
        );
        return;
      default:
        exhaustiveGuard(this.#selectedAttackMenuOption);
    }
  }

  #switchToMainBattleMenu() {
    this.#waitingForPlayerInput = false;
    this.hideInputCursor();
    this.hideMonsterAttackSubMenu();
    this.showMainBattleMenu();
  }

  #handlePlayerChooseMainBattleOption() {
    this.hideMainBattleMenu();

    if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.FIGHT) {
      this.showMonsterAttackSubMenu();
      return;
    }

    if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.ITEM) {
      // TODO: add feature in a future update
      /*
        for the time being, we will display text about the player having no items
        and allow the player to navigate back to the main menu
      */
      this.#activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_FLEE;
      this.updateInfoPaneMessagesAndWaitForInput(
        ["Your bag is empty..."],
        () => {
          this.#switchToMainBattleMenu();
        },
        SKIP_BATTLE_ANIMATION
      );
      return;
    }

    if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.SWITCH) {
      // TODO: add feature in a future update
      /*
        for the time being, we will display text about the player having no more monsters
        and allow the player to navigate back to the main menu
      */
      this.#activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_SWITCH;
      this.updateInfoPaneMessagesAndWaitForInput(
        ["You have no other monsters in your party..."],
        () => {
          this.#switchToMainBattleMenu();
        },
        SKIP_BATTLE_ANIMATION
      );
      return;
    }

    if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.FLEE) {
      // TODO: add feature in a future update
      /*
        for the time being, we will display text about the player successfully running away
        and then restart the Phaser scene after doing a screen fade out
      */
      this.#activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_FLEE;
      this.updateInfoPaneMessagesAndWaitForInput(
        ["You fail to run away..."],
        () => {
          this.#switchToMainBattleMenu();
        },
        SKIP_BATTLE_ANIMATION
      );
      return;
    }

    exhaustiveGuard(this.#selectedBattleMenuOption);
  }

  #handlePlayerChooseAttack() {
    let selectedMoveIndex = 0;

    switch (this.#selectedAttackMenuOption) {
      case ATTACK_MOVE_OPTIONS.MOVE_1:
        selectedMoveIndex = 0;
        break;
      case ATTACK_MOVE_OPTIONS.MOVE_2:
        selectedMoveIndex = 1;
        break;
      case ATTACK_MOVE_OPTIONS.MOVE_3:
        selectedMoveIndex = 2;
        break;
      case ATTACK_MOVE_OPTIONS.MOVE_4:
        selectedMoveIndex = 3;
        break;
      default:
        exhaustiveGuard(this.#selectedAttackMenuOption);
    }

    this.#selectedAttackIndex = selectedMoveIndex;
  }

  #createPlayerInputCursor() {
    this.#userInputCursorPhaserImageGameObject = this.#scene.add.image(
      0,
      0,
      UI_ASSET_KEYS.CURSOR
    );
    this.#userInputCursorPhaserImageGameObject.setAngle(90).setScale(2.5, 1.25);
    this.#userInputCursorPhaserImageGameObject.setAlpha(0);

    this.#userInputCursorPhaserTween = this.#scene.add.tween({
      delay: 0,
      duration: 500,
      repeat: -1,
      y: {
        from: PLAYER_INPUT_CURSOR_POS.y,
        start: PLAYER_INPUT_CURSOR_POS.y,
        to: PLAYER_INPUT_CURSOR_POS.y + 6,
      },
      targets: this.#userInputCursorPhaserImageGameObject,
    });
    this.#userInputCursorPhaserTween.pause();
  }
}
