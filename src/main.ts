import { AUTO, Game, Scale, Types } from "phaser";
import { Preload } from "./scenes/Preload";
import { Battle } from "./scenes/Battle";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
  type: AUTO, // WebGL을 쓰고 있으면 WebGL을 쓰고, 없으면 Canvas를 쓴다.
  pixelArt: false, // 이미지 픽셀을 보존할 것인지
  scale: {
    parent: "game-container",
    width: 1024,
    height: 576,
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
  backgroundColor: "#000000",
  scene: [Preload, Battle],
};

export default new Game(config);
