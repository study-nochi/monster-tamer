import { Scene } from "phaser";
import { SCENE_KEYS } from "../constants/scene";
import {
  ATTACK_ASSET_KEYS,
  BATTLE_ASSET_KEYS,
  BATTLE_BACKGROUND_ASSET_KEYS,
  DATA_ASSET_KEYS,
  HEALTH_BAR_ASSET_KEYS,
  KENNEY_FUTURE_NARROW_FONT_NAME,
  MONSTER_ASSET_KEYS,
  UI_ASSET_KEYS,
} from "../constants/asset";
import { WebFontFileLoader } from "../utils/web-font-file-loader";

export class Preload extends Scene {
  constructor() {
    super({
      key: SCENE_KEYS.PRELOAD_SCENE,
      active: true,
    });
  }

  preload() {
    console.log(`[${Preload.name}:preload] invoked`);

    const monsterTamerAssetPath = "assets/images/monster-tamer";
    const kenneysAssetPath = "assets/images/kenneys-assets";
    const dataAssetPath = "assets/data";
    const pimenAssetPath = "assets/pimen";

    Promise.all([
      // battle backgrounds
      this.load.image(
        BATTLE_BACKGROUND_ASSET_KEYS.FOREST,
        `${monsterTamerAssetPath}/battle-backgrounds/forest-background.png`
      ),

      // battle assets
      this.load.image(
        BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND,
        `${kenneysAssetPath}/ui-space-expansion/custom-ui.png`
      ),

      // health bar assets
      this.load.image(
        HEALTH_BAR_ASSET_KEYS.RIGHT_CAP,
        `${kenneysAssetPath}/ui-space-expansion/barHorizontal_green_right.png`
      ),
      this.load.image(
        HEALTH_BAR_ASSET_KEYS.MIDDLE,
        `${kenneysAssetPath}/ui-space-expansion/barHorizontal_green_mid.png`
      ),
      this.load.image(
        HEALTH_BAR_ASSET_KEYS.LEFT_CAP,
        `${kenneysAssetPath}/ui-space-expansion/barHorizontal_green_left.png`
      ),

      this.load.image(
        HEALTH_BAR_ASSET_KEYS.RIGHT_CAP_SHADOW,
        `${kenneysAssetPath}/ui-space-expansion/barHorizontal_shadow_right.png`
      ),
      this.load.image(
        HEALTH_BAR_ASSET_KEYS.MIDDLE_SHADOW,
        `${kenneysAssetPath}/ui-space-expansion/barHorizontal_shadow_mid.png`
      ),
      this.load.image(
        HEALTH_BAR_ASSET_KEYS.LEFT_CAP_SHADOW,
        `${kenneysAssetPath}/ui-space-expansion/barHorizontal_shadow_left.png`
      ),

      // monster assets
      this.load.image(
        MONSTER_ASSET_KEYS.IGUANIGNITE,
        `${monsterTamerAssetPath}/monsters/iguanignite.png`
      ),
      this.load.image(
        MONSTER_ASSET_KEYS.CARNODUSK,
        `${monsterTamerAssetPath}/monsters/carnodusk.png`
      ),

      // ui assets
      this.load.image(
        UI_ASSET_KEYS.CURSOR,
        `${monsterTamerAssetPath}/ui/cursor.png`
      ),

      // load json data
      this.load.json(DATA_ASSET_KEYS.ATTACKS, `${dataAssetPath}/attacks.json`),

      // load custom fonts
      this.load.addFile(
        new WebFontFileLoader(this.load, [KENNEY_FUTURE_NARROW_FONT_NAME])
      ),

      // load attack assets
      this.load.spritesheet(
        ATTACK_ASSET_KEYS.ICE_SHARD,
        `${pimenAssetPath}/ice-attack/active.png`,
        {
          frameWidth: 32,
          frameHeight: 32,
        }
      ),
      this.load.spritesheet(
        ATTACK_ASSET_KEYS.ICE_SHARD_START,
        `${pimenAssetPath}/ice-attack/start.png`,
        {
          frameWidth: 32,
          frameHeight: 32,
        }
      ),
      this.load.spritesheet(
        ATTACK_ASSET_KEYS.SLASH,
        `${pimenAssetPath}/slash.png`,
        {
          frameWidth: 48,
          frameHeight: 48,
        }
      ),
    ]).then(() => {
      console.log(`[${Preload.name}:preload] assets loaded`);
    });
  }

  create() {
    console.log(`[${Preload.name}:create] invoked`);
    this.scene.start(SCENE_KEYS.BATTLE_SCENE);
  }
}
