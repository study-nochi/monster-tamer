import {
  BATTLE_ASSET_KEYS,
  DATA_ASSET_KEYS,
  MONSTER_ASSET_KEYS,
} from "../../constants/asset";
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
  _phaserHealthBarGameContainer: Phaser.GameObjects.Container;

  constructor(
    config: {
      _scene: Phaser.Scene;
      _monsterDetails: Monster;
      scaleHealthBarBackgroundImageByY?: number;
    },
    position: Coordinate
  ) {
    this._scene = config._scene;
    this._monsterDetails = config._monsterDetails;
    this._currentHealth = this._monsterDetails.currentHp;
    this._maxHealth = this._monsterDetails.maxHp;
    this._monsterAttack = [];

    this._phaserGameObject = this._scene.add.image(
      position.x,
      position.y,
      this._monsterDetails.assetKey,
      this._monsterDetails.assetFrame ?? 0
    );
    this.#createHealthBarComponents(config.scaleHealthBarBackgroundImageByY);

    const data: Attack[] = this._scene.cache.json.get(DATA_ASSET_KEYS.ATTACKS);
    console.log("data", data);
    console.log("this._scene.cache.json", this._scene.cache.json);

    this._monsterDetails.attackIds.forEach((attackId) => {
      const monsterAttack = data?.find((attack) => attack.id === attackId);
      if (monsterAttack) {
        this._monsterAttack.push(monsterAttack);
      }
    });
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

  get level(): number {
    return this._monsterDetails.currentLevel;
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

  #createHealthBarComponents(
    scaleHealthBarBackgroundImageByY: number = 1
  ): void {
    this._healthBar = new HealthBar(this._scene, 34, 34);

    const monsterNameGameText = this._scene.add.text(
      30,
      20,
      MONSTER_ASSET_KEYS.CARNODUSK,
      {
        color: "#7E3D3F",
        fontSize: "32px",
      }
    );

    const healthBarBgImage = this._scene.add
      .image(0, 0, BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND)
      .setOrigin(0)
      .setScale(1, scaleHealthBarBackgroundImageByY);

    const monsterHealthBarLevelText = this._scene.add.text(
      monsterNameGameText.width + 35,
      23,
      `L${this._monsterDetails.currentLevel}`,
      {
        color: "#ED474B",
        fontSize: "28px",
      }
    );

    const monsterHpText = this._scene.add.text(30, 55, "HP", {
      color: "#FF6505",
      fontSize: "24px",
      fontStyle: "italic",
    });

    this._phaserHealthBarGameContainer = this._scene.add.container(0, 0, [
      healthBarBgImage,
      monsterNameGameText,
      this._healthBar.container,
      monsterHealthBarLevelText,
      monsterHpText,
    ]);
  }
}
