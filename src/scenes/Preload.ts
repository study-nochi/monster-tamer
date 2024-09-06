import { Scene } from "phaser";
import { SCENE_KEY } from "../constants/sceen";
import {
  BATTLE_ASSET_KEYS,
  BATTLE_BACKGROUND_ASSET_KEYS,
  HEALTH_BAR_ASSET_KEYS,
  MONSTER_ASSET_KEYS,
} from "../constants/asset";

export class Preload extends Scene {
  constructor() {
    super({
      key: SCENE_KEY.PRELOAD_SCENE,
      active: true
    });
  }

  preload() {
    const monsterTamerAssetPath = "assets/images/monster-tamer";
    const kenneysAssetPath = "assets/images/kenneys-assets";

    // battle backgrounds
    this.load.image(
      BATTLE_BACKGROUND_ASSET_KEYS.FOREST,
      `${monsterTamerAssetPath}/battle-backgrounds/forest-background.png`
    );

    // battle assets
    this.load.image(
      BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND,
      `${kenneysAssetPath}/ui-space-expansion/custom-ui.png`
    );

    // health bar assets
    this.load.image(
      HEALTH_BAR_ASSET_KEYS.RIGHT_CAP,
      `${kenneysAssetPath}/ui-space-expansion/barHorizontal_green_right.png`
    );
    this.load.image(
      HEALTH_BAR_ASSET_KEYS.MIDDLE,
      `${kenneysAssetPath}/ui-space-expansion/barHorizontal_green_mid.png`
    );
    this.load.image(
      HEALTH_BAR_ASSET_KEYS.LEFT_CAP,
      `${kenneysAssetPath}/ui-space-expansion/barHorizontal_green_left.png`
    );

    // monster assets
    this.load.image(
      MONSTER_ASSET_KEYS.IGUANIGNITE,
      `${monsterTamerAssetPath}/monsters/iguanignite.png`
    );
    this.load.image(
      MONSTER_ASSET_KEYS.CARNODUSK,
      `${monsterTamerAssetPath}/monsters/carnodusk.png`
    );
  }

  create() {
    this.textures.get(BATTLE_BACKGROUND_ASSET_KEYS.FOREST);
    this.add.image(0,0, BATTLE_BACKGROUND_ASSET_KEYS.FOREST).setOrigin(0,0);
  }
}
