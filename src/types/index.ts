export interface BattleMonsterConfig {
  _scene: Phaser.Scene;
  _monsterDetails: Monster;
  scaleHealthBarBackgroundImageByY?: number;
}

export interface Monster {
  name: string;
  assetKey: string;
  maxHp: number;
  assetFrame: number;
  currentLevel: number;
  currentHp: number;
  baseAttack: number;
  attackIds: string[];
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface Attack {
  id: number;
  name: string;
  animationName: string;
}
