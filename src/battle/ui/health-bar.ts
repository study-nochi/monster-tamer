import { GameObjects, Scene } from "phaser";
import { HEALTH_BAR_ASSET_KEYS } from "../../constants/asset";

export class HealthBar {
  #scene: Scene;
  #healBarContainer: GameObjects.Container;
  #fullWidth: number;
  #scaleY: number;

  #leftCap: GameObjects.Image;
  #middle: GameObjects.Image;
  #rightCap: GameObjects.Image;

  constructor(scene: Scene, x: number, y: number) {
    this.#scene = scene;
    this.#fullWidth = 360;
    this.#scaleY = 0.7;

    this.#healBarContainer = this.#scene.add.container(x, y, []);
    this.#createHealthBarImages(x, y);
    this.#setMeterPercentage(1);
  }

  get container() {
    return this.#healBarContainer;
  }

  #createHealthBarImages(x: number, y: number): void {
    this.#leftCap = this.#scene.add
      .image(x, y, HEALTH_BAR_ASSET_KEYS.LEFT_CAP)
      .setOrigin(0, 0.5)
      .setScale(1, this.#scaleY);
    this.#middle = this.#scene.add
      .image(
        this.#leftCap.x + this.#leftCap.width,
        y,
        HEALTH_BAR_ASSET_KEYS.MIDDLE
      )
      .setOrigin(0, 0.5)
      .setScale(1, this.#scaleY);
    this.#rightCap = this.#scene.add
      .image(
        this.#middle.x + this.#middle.displayWidth,
        y,
        HEALTH_BAR_ASSET_KEYS.RIGHT_CAP
      )
      .setOrigin(0, 0.5)
      .setScale(1, this.#scaleY);

    this.#healBarContainer.add([this.#leftCap, this.#middle, this.#rightCap]);
  }

  #setMeterPercentage(percent = 1) {
    const width = this.#fullWidth * percent;

    this.#middle.displayWidth = width;
    this.#rightCap.x = this.#middle.x + this.#middle.displayWidth;
  }

  setMeterPercentageAnimated(
    percent: number,
    options: {
      duration?: number;
      callback?: () => void;
    }
  ) {
    const width = this.#fullWidth * percent;

    this.#scene.tweens.add({
      targets: this.#middle,
      displayWidth: width,
      duration: options?.duration || 1000,
      ease: Phaser.Math.Easing.Sine.Out,
      onUpdate: () => {
        this.#rightCap.x = this.#middle.x + this.#middle.displayWidth;
        const isVisible = this.#middle.displayWidth > 0;
        this.#leftCap.visible = isVisible;
        this.#middle.visible = isVisible;
        this.#rightCap.visible = isVisible;
      },
      onComplete: options?.callback,
    });
  }
}
