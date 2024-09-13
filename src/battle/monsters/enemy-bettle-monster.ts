import { ENEMY_POSITION } from "../../constants/battle";
import { BattleMonsterConfig } from "../../types";
import { BattleMonster } from "./battle-monster";

export class EnemyBattleMonster extends BattleMonster {
  constructor(config: BattleMonsterConfig) {
    super({ ...config, scaleHealthBarBackgroundImageByY: 0.8 }, ENEMY_POSITION);
  }

  playMonsterAppearAnimation(callback?: () => void): void {
    const startXPos = -30;
    const endXPos = ENEMY_POSITION.x;

    this._phaserGameObject.setPosition(startXPos, ENEMY_POSITION.y);
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
      duration: 1600,
      ease: "Power2",
      onComplete: callback,
    });
  }

  playMonsterHealthBarAppearAnimation(callback?: () => void): void {
    const startXPos = -600;
    const endXPos = 0;

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
      duration: 1500,
      ease: "Power2",
      onComplete: callback,
    });
  }

  playDeathAnimation(callback?: () => void): void {
    const startYPos = this._phaserGameObject.y;
    const endYPos = startYPos - 400;

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
