import { GameObjects, Scene } from "phaser";
import { BATTLE_BACKGROUND_ASSET_KEYS } from "../constants/asset";

export class Background {
  #scene: Scene;
  #backgroundGameObject: GameObjects.Image;

  constructor(scene: Scene) {
    this.#scene = scene;
    this.#backgroundGameObject = this.#scene.add
      .image(0, 0, BATTLE_BACKGROUND_ASSET_KEYS.FOREST)
      .setOrigin(0)
      .setAlpha(0);
  }

  showForest() {
    this.#backgroundGameObject
      .setTexture(BATTLE_BACKGROUND_ASSET_KEYS.FOREST)
      .setAlpha(1);
  }
}
