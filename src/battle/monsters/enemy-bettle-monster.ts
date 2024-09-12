import { ENEMY_POSITION } from "../../constants/battle";
import { BattleMonsterConfig } from "../../types";
import { BattleMonster } from "./battle-monster";

export class EnemyBattleMonster extends BattleMonster {
  constructor(config: BattleMonsterConfig) {
    super(config, ENEMY_POSITION);
  }
}
