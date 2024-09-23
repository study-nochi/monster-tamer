import { ATTACK_KEYS } from "../battle/attacks/attack-keys";

export interface BattleMonsterConfig {
  _scene: Phaser.Scene;
  _monsterDetails: Monster;
  scaleHealthBarBackgroundImageByY?: number;
  skipBattleAnimation?: boolean;
}

export interface Monster {
  name: string;
  assetKey: string;
  maxHp: number;
  assetFrame: number;
  currentLevel: number;
  currentHp: number;
  baseAttack: number;
  attackIds: number[];
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface Attack {
  id: number;
  name: string;
  animationName: ATTACK_KEYS;
}
