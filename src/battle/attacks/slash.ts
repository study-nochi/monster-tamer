import { ATTACK_ASSET_KEYS } from "../../constants/asset";
import { Coordinate } from "../../types";
import { Attack } from "./attacks";

export class Slash extends Attack {
  protected _attackGameObject: Phaser.GameObjects.Container;
  protected _attackGameObject1: Phaser.GameObjects.Sprite;
  protected _attackGameObject2: Phaser.GameObjects.Sprite;
  protected _attackGameObject3: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, position: Coordinate) {
    super(scene, position);

    this._scene.anims.create({
      key: ATTACK_ASSET_KEYS.SLASH,
      frames: this._scene.anims.generateFrameNumbers(ATTACK_ASSET_KEYS.SLASH),
      frameRate: 4,
      repeat: 0,
      delay: 0,
    });

    // create game objects

    this._attackGameObject1 = this._scene.add
      .sprite(0, 0, ATTACK_ASSET_KEYS.SLASH, 5)
      .setOrigin(0.5)
      .setScale(4);
    this._attackGameObject2 = this._scene.add
      .sprite(30, 0, ATTACK_ASSET_KEYS.SLASH, 5)
      .setOrigin(0.5)
      .setScale(4);
    this._attackGameObject3 = this._scene.add
      .sprite(-30, 0, ATTACK_ASSET_KEYS.SLASH, 5)
      .setOrigin(0.5)
      .setScale(4);

    this._attackGameObject = this._scene.add
      .container(position.x, position.y, [
        this._attackGameObject1,
        this._attackGameObject2,
        this._attackGameObject3,
      ])
      .setAlpha(0);
  }

  playAnimation(callback?: () => void): void {
    if (this._isAnimationPlaying) {
      return;
    }

    this._isAnimationPlaying = true;
    this._attackGameObject.setAlpha(1);

    this._attackGameObject1.play(ATTACK_ASSET_KEYS.SLASH);
    this._attackGameObject2.play(ATTACK_ASSET_KEYS.SLASH);
    this._attackGameObject3.play(ATTACK_ASSET_KEYS.SLASH);

    this._attackGameObject1.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + ATTACK_ASSET_KEYS.SLASH,
      () => {
        this._isAnimationPlaying = false;
        this._attackGameObject.setAlpha(0);
        this._attackGameObject1.setFrame(0);
        this._attackGameObject2.setFrame(0);
        this._attackGameObject3.setFrame(0);

        if (callback) {
          callback();
        }
      }
    );
  }
}
