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

  playMonsterAppearAnimation(callback?: () => void): void {
    const startXPos = -30;
    const endXPos = PLAYER_POSITION.x;

    this._phaserGameObject.setPosition(startXPos, PLAYER_POSITION.y);
    this._phaserGameObject.setAlpha(1);

    if (this._skipBattleAnimation) {
      this._phaserGameObject.setX(endXPos);
      callback?.();
      return;
    }

    this._scene.tweens.add({
      targets: this._phaserGameObject,
      x: {
        from: startXPos,
        start: startXPos,
        to: endXPos,
      },
      delay: 0,
      duration: 800,
      ease: "Power2",
      onComplete: callback,
    });
  }

  playMonsterHealthBarAppearAnimation(callback?: () => void): void {
    const startXPos = 800;
    const endXPos = this._phaserHealthBarGameContainer.x;

    this._phaserHealthBarGameContainer.setPosition(
      startXPos,
      this._phaserHealthBarGameContainer.y
    );
    this._phaserHealthBarGameContainer.setAlpha(1);

    if (this._skipBattleAnimation) {
      this._phaserHealthBarGameContainer.setX(endXPos);
      callback?.();
      return;
    }

    this._scene.tweens.add({
      targets: this._phaserHealthBarGameContainer,
      x: {
        from: startXPos,
        start: startXPos,
        to: endXPos,
      },
      delay: 0,
      duration: 800,
      ease: "Power2",
      onComplete: callback,
    });
  }

  playDeathAnimation(callback?: () => void): void {
    const startYPos = this._phaserGameObject.y;
    const endYPos = startYPos + 400;

    if (this._skipBattleAnimation) {
      this._phaserGameObject.setX(endYPos);
      callback?.();
      return;
    }

    this._scene.tweens.add({
      targets: this._phaserGameObject,
      y: {
        from: startYPos,
        start: startYPos,
        to: endYPos,
      },
      delay: 0,
      duration: 2000,
      ease: "Power2",
      onComplete: callback,
    });
  }
}
