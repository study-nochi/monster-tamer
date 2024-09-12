import { DATA_ASSET_KEYS } from "../constants/asset";
import { Attack } from "../types";

export class DataUtils {
  static getMonsterAttack(scene: Phaser.Scene, attackId: number) {
    const monsterData: Attack[] = scene.cache.json.get(DATA_ASSET_KEYS.ATTACKS);
    return monsterData?.find((attack) => attack.id === attackId);
  }
}
