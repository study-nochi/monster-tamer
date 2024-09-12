import { PLAYER_POSITION } from "../../constants/battle";
import { BattleMonsterConfig } from "../../types";
import { BattleMonster } from "./battle-monster";

export class PlayerBattleMonster extends BattleMonster {
  #healthBarTextGameObject: Phaser.GameObjects.Text;

  constructor(config: BattleMonsterConfig) {
    super(
      { ...config, scaleHealthBarBackgroundImageByY: 0.8 },
      PLAYER_POSITION
    );
    this._phaserGameObject.setFlipX(true);
    this._phaserHealthBarGameContainer.setPosition(556, 318);

    this.#addHealthBarComponents();
  }

  #setHealthBarText() {
    this.#healthBarTextGameObject.setText(
      `${this._currentHealth}/${this._maxHealth}`
    );
  }

  #addHealthBarComponents() {
    this.#healthBarTextGameObject = this._scene.add
      .text(443, 80, "", {
        color: "#7E3D3F",
        fontSize: "16px",
      })
      .setOrigin(1, 0);
    this.#setHealthBarText();

    this._phaserHealthBarGameContainer.add(this.#healthBarTextGameObject);
  }

  takeDamage(damage: number, callback?: () => void): void {
    super.takeDamage(damage, callback);
    this.#setHealthBarText();
  }
}
