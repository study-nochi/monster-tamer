import { HealthBar } from "../ui/health-bar";

interface Monster {
  name: string;
  assetKey: string;
  maxHp: number;
  assetFrame: number;
  currentHp: number;
  baseAttack: number;
  attackIds: string[];
}

interface Coordinate {
  x: number;
  y: number;
}

export class BattleMonster {
  _scene: Phaser.Scene;
  _monsterDetails: Monster;
  _healthBar: HealthBar;
  _phaserGameObject: Phaser.GameObjects.Image;

  constructor(
    config: { scene: Phaser.Scene; monsterDetails: Monster },
    position: Coordinate
  ) {
    this._scene = config.scene;
    this._monsterDetails = config.monsterDetails;

    this._healthBar = new HealthBar(this._scene, 34, 34);
    this._phaserGameObject = this._scene.add.image(
      position.x,
      position.y,
      this._monsterDetails.assetKey,
      this._monsterDetails.assetFrame ?? 0
    );
  }
}
