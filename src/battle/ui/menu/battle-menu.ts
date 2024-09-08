import { MONSTER_ASSET_KEYS } from "../../../constants/asset";
import { BATTLE_MENU_OPTIONS } from "./battle-menu.constants";
import { battleUiTextStyle } from "./battle-menu.css";

export class BattleMenu {
  #scene;
  #mainBattleMenuPhaserContainerGameObject: Phaser.GameObjects.Container;
  #moveSelectionSubBattleMenuPhaserContainerGameObject: Phaser.GameObjects.Container;
  #battleTextGameObjectLine1: Phaser.GameObjects.Text;
  #battleTextGameObjectLine2: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.#scene = scene;
    this.#createMainInfoPane();
    this.#createMainBattleMenu();
    this.#createMonsterAttackSubMenu();
  }

  showMainBattleMenu() {
    this.#battleTextGameObjectLine1.setText("what should");
    this.#mainBattleMenuPhaserContainerGameObject.setAlpha(1);
    this.#battleTextGameObjectLine1.setAlpha(1);
    this.#battleTextGameObjectLine2.setAlpha(2);
  }

  hideMainBattleMenu() {
    this.#mainBattleMenuPhaserContainerGameObject.setAlpha(0);
    this.#battleTextGameObjectLine1.setAlpha(0);
    this.#battleTextGameObjectLine2.setAlpha(0);
  }

  showMonsterAttackSubMenu() {
    this.#moveSelectionSubBattleMenuPhaserContainerGameObject.setAlpha(1);
  }

  hideMonsterAttackSubMenu() {
    this.#moveSelectionSubBattleMenuPhaserContainerGameObject.setAlpha(0);
  }

  // Todo: update to use monster data that is passed into this class instance
  #createMainBattleMenu() {
    this.#battleTextGameObjectLine1 = this.#scene.add.text(
      20,
      468,
      "what should",
      battleUiTextStyle
    );
    this.#battleTextGameObjectLine2 = this.#scene.add.text(
      20,
      512,
      `${MONSTER_ASSET_KEYS.IGUANIGNITE} do next?`,
      battleUiTextStyle
    );
    this.#mainBattleMenuPhaserContainerGameObject = this.#scene.add.container(
      520,
      448,
      [
        this.#createMainInfoSubPane(),
        this.#scene.add.text(
          55,
          22,
          BATTLE_MENU_OPTIONS.FIGHT,
          battleUiTextStyle
        ),
        this.#scene.add.text(
          240,
          22,
          BATTLE_MENU_OPTIONS.SWITCH,
          battleUiTextStyle
        ),
        this.#scene.add.text(
          55,
          70,
          BATTLE_MENU_OPTIONS.ITEM,
          battleUiTextStyle
        ),
        this.#scene.add.text(
          240,
          70,
          BATTLE_MENU_OPTIONS.FLEE,
          battleUiTextStyle
        ),
      ]
    );

    this.hideMainBattleMenu();
  }

  #createMonsterAttackSubMenu() {
    this.#moveSelectionSubBattleMenuPhaserContainerGameObject =
      this.#scene.add.container(0, 448, [
        this.#scene.add.text(55, 22, "slash", battleUiTextStyle),
        this.#scene.add.text(240, 22, "growl", battleUiTextStyle),
        this.#scene.add.text(55, 70, "-", battleUiTextStyle),
        this.#scene.add.text(240, 70, "-", battleUiTextStyle),
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
}
