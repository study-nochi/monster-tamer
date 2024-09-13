import { ATTACK_ASSET_KEYS } from "../../constants/asset";
import { Coordinate } from "../../types";
import { Attack } from "./attacks";

export class IceShard extends Attack {
  _attackGameObject: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, position: Coordinate) {
    super(scene, position);

    this._attackGameObject = this._scene.add
      .sprite(
        this._position.x,
        this._position.y,
        ATTACK_ASSET_KEYS.ICE_SHARD,
        4
      )
      .setOrigin(0.5)
      .setScale(4)
      .setAlpha(0);
  }
}
