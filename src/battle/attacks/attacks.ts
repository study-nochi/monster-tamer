import { Coordinate } from "../../types";

export class Attack {
  _scene: Phaser.Scene;
  _position: Coordinate;
  _isAnimationPlaying: boolean;
  _attackGameObject: Phaser.GameObjects.Sprite | Phaser.GameObjects.Container | undefined;

  constructor(scene: Phaser.Scene, position: Coordinate) {
    this._scene = scene;
    this._position = position;
    this._isAnimationPlaying = false;
    this._attackGameObject = undefined;
  }

  get gameObject(): Phaser.GameObjects.Sprite | Phaser.GameObjects.Container | undefined {
    return this._attackGameObject;
  }

  playAnimation(callback?: () => void): void {
    throw new Error("playAnimation not implemented");
  }
}
 