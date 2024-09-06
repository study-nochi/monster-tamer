import { Scene } from "phaser";
import { SCENE_KEY } from "../constants/scene";
import {
  BATTLE_BACKGROUND_ASSET_KEYS,
  MONSTER_ASSET_KEYS,
} from "../constants/asset";

export class Battle extends Scene {
  constructor() {
    super({
      key: SCENE_KEY.BATTLE_SCENE,
      active: true,
    });
  }

  preload() {
    console.log(`[${Battle.name}:preload] invoked`);
  }

  create() {
    console.log(`[${Battle.name}:create] invoked`);
    // created main background
    this.add.image(0, 0, BATTLE_BACKGROUND_ASSET_KEYS.FOREST).setOrigin(0, 0);

    // render out the player and enemy monsters
    this.add.image(768, 144, MONSTER_ASSET_KEYS.CARNODUSK, 0);
    this.add.image(256, 316, MONSTER_ASSET_KEYS.IGUANIGNITE, 0).setFlipX(true);
  }
}
