import { MONSTER_ASSET_KEYS, UI_ASSET_KEYS } from "../../../constants/asset";
import { DIRECTION } from "../../../constants/direction";
import { exhaustiveGuard } from "../../../utils/guard";
import { BATTLE_UI_TEXT_STYLE } from "./battle-menu-config";
import {
  ACTIVE_BATTLE_MENU,
  ATTACK_MENU_CURSOR,
  ATTACK_MOVE_OPTIONS,
  BATTLE_MENU_CURSOR_POSITIONS,
  BATTLE_MENU_OPTIONS,
  BATTLE_PLAYER_INPUT,
  DISTANCE_TO_MOVE_CURSOR,
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
  #selectedAttackMoveOption: ATTACK_MOVE_OPTIONS;
  #activeBattleMenu: ACTIVE_BATTLE_MENU;

  constructor(scene: Phaser.Scene) {
    this.#scene = scene;
    this.#activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_MAIN;
    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
    this.#selectedAttackMoveOption = ATTACK_MOVE_OPTIONS.MOVE_1;
    this.#createMainInfoPane();
    this.#createMainBattleMenu();
    this.#createMonsterAttackSubMenu();
  }

  showMainBattleMenu() {
    this.#activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_MAIN;
    this.#battleTextGameObjectLine1.setText("what should");
    this.#mainBattleMenuPhaserContainerGameObject.setAlpha(1);
    this.#battleTextGameObjectLine1.setAlpha(1);
    this.#battleTextGameObjectLine2.setAlpha(2);

    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
    this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(
      BATTLE_MENU_CURSOR_POSITIONS.x,
      BATTLE_MENU_CURSOR_POSITIONS.y
    );
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
    this.#moveSelectionSubBattleMenuPhaserContainerGameObject.setAlpha(0);
  }

  handlePlayerInput(input: BATTLE_PLAYER_INPUT | DIRECTION) {
    console.log(input);
    if (input === BATTLE_PLAYER_INPUT.CANCEL) {
      this.hideMonsterAttackSubMenu();
      this.showMainBattleMenu();
      return;
    }

    if (input === BATTLE_PLAYER_INPUT.OK) {
      this.hideMainBattleMenu();
      this.showMonsterAttackSubMenu();
      return;
    }

    this.#updateSelectedBattleMenuOptionFromInput(input);
    this.#moveMainBattleMenuCursor();
    this.#updateSelectedMoveMenuOptionFromInput(input);
    this.#moveMoveSelectBattleMenuCursor();
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
      `${MONSTER_ASSET_KEYS.IGUANIGNITE} do next?`,
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
    this.#moveSelectionSubBattleMenuPhaserContainerGameObject =
      this.#scene.add.container(0, 448, [
        this.#scene.add.text(55, 22, "slash", BATTLE_UI_TEXT_STYLE),
        this.#scene.add.text(240, 22, "growl", BATTLE_UI_TEXT_STYLE),
        this.#scene.add.text(55, 70, "-", BATTLE_UI_TEXT_STYLE),
        this.#scene.add.text(240, 70, "-", BATTLE_UI_TEXT_STYLE),
        this.#attackBattleMenuCursorPhaserImageGameObject,
      ]);
    this.hideMonsterAttackSubMenu();
  }

  #createMainInfoPane() {
    const rectHeight = 124;
    const padding = 4;

    this.#scene.add
      .rectangle(
        0,
        this.#scene.scale.height - rectHeight - padding,
        this.#scene.scale.width - padding * 2,
        rectHeight,
        0xede4f3,
        0.2
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
          BATTLE_MENU_CURSOR_POSITIONS.x + DISTANCE_TO_MOVE_CURSOR.right,
          BATTLE_MENU_CURSOR_POSITIONS.y
        );
        return;
      case BATTLE_MENU_OPTIONS.ITEM:
        this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(
          BATTLE_MENU_CURSOR_POSITIONS.x,
          BATTLE_MENU_CURSOR_POSITIONS.y + DISTANCE_TO_MOVE_CURSOR.down
        );
        return;
      case BATTLE_MENU_OPTIONS.FLEE:
        this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(
          BATTLE_MENU_CURSOR_POSITIONS.x + DISTANCE_TO_MOVE_CURSOR.right,
          BATTLE_MENU_CURSOR_POSITIONS.y + DISTANCE_TO_MOVE_CURSOR.down
        );
        return;
      default:
        exhaustiveGuard(this.#selectedBattleMenuOption);
    }
  }

  #updateSelectedMoveMenuOptionFromInput(direction: DIRECTION) {
    if (this.#activeBattleMenu !== ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT) {
      return;
    }

    if (this.#selectedAttackMoveOption === ATTACK_MOVE_OPTIONS.MOVE_1) {
      switch (direction) {
        case DIRECTION.RIGHT:
          this.#selectedAttackMoveOption = ATTACK_MOVE_OPTIONS.MOVE_2;
          return;
        case DIRECTION.DOWN:
          this.#selectedAttackMoveOption = ATTACK_MOVE_OPTIONS.MOVE_3;
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

    if (this.#selectedAttackMoveOption === ATTACK_MOVE_OPTIONS.MOVE_2) {
      switch (direction) {
        case DIRECTION.LEFT:
          this.#selectedAttackMoveOption = ATTACK_MOVE_OPTIONS.MOVE_1;
          return;
        case DIRECTION.DOWN:
          this.#selectedAttackMoveOption = ATTACK_MOVE_OPTIONS.MOVE_4;
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

    if (this.#selectedAttackMoveOption === ATTACK_MOVE_OPTIONS.MOVE_3) {
      switch (direction) {
        case DIRECTION.RIGHT:
          this.#selectedAttackMoveOption = ATTACK_MOVE_OPTIONS.MOVE_4;
          return;
        case DIRECTION.UP:
          this.#selectedAttackMoveOption = ATTACK_MOVE_OPTIONS.MOVE_1;
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

    if (this.#selectedAttackMoveOption === ATTACK_MOVE_OPTIONS.MOVE_4) {
      switch (direction) {
        case DIRECTION.LEFT:
          this.#selectedAttackMoveOption = ATTACK_MOVE_OPTIONS.MOVE_3;
          return;
        case DIRECTION.UP:
          this.#selectedAttackMoveOption = ATTACK_MOVE_OPTIONS.MOVE_2;
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

    exhaustiveGuard(this.#selectedAttackMoveOption);
  }

  #moveMoveSelectBattleMenuCursor() {
    if (this.#activeBattleMenu !== ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT) {
      return;
    }

    switch (this.#selectedAttackMoveOption) {
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
        exhaustiveGuard(this.#selectedAttackMoveOption);
    }
  }
}
