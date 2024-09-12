import { Monster, Coordinate, BattleMonsterConfig, Attack } from "../../types";
import { HealthBar } from "../ui/health-bar";

export class BattleMonster implements BattleMonsterConfig {
  _scene: Phaser.Scene;
  _monsterDetails: Monster;
  _healthBar: HealthBar;
  _phaserGameObject: Phaser.GameObjects.Image;
  _currentHealth: number;
  _maxHealth: number;
  _monsterAttack: Attack[];

  constructor(
    config: { _scene: Phaser.Scene; _monsterDetails: Monster },
    position: Coordinate
  ) {
    this._scene = config._scene;
    this._monsterDetails = config._monsterDetails;
    this._currentHealth = this._monsterDetails.currentHp;
    this._maxHealth = this._monsterDetails.maxHp;
    this._monsterAttack = [];

    this._healthBar = new HealthBar(this._scene, 34, 34);
    this._phaserGameObject = this._scene.add.image(
      position.x,
      position.y,
      this._monsterDetails.assetKey,
      this._monsterDetails.assetFrame ?? 0
    );
  }

  get isFainted(): boolean {
    return this._currentHealth <= 0;
  }

  get name(): string {
    return this._monsterDetails.name;
  }

  get attacks(): Attack[] {
    return [...this._monsterAttack];
  }

  get baseAttack(): number {
    return this._monsterDetails.baseAttack;
  }

  takeDamage(damage: number, callback?: () => void): void {
    this._currentHealth -= damage;

    if (this._currentHealth <= 0) {
      this._currentHealth = 0;
    }

    this._healthBar.setMeterPercentageAnimated(
      this._currentHealth / this._maxHealth,
      {
        callback,
      }
    );
  }
}
