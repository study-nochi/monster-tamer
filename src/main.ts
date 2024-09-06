import { AUTO, Game, Scale, Types } from "phaser";
import { Preload } from "./scenes/Preload";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
  type: AUTO, // WebGL을 쓰고 있으면 WebGL을 쓰고, 없으면 Canvas를 쓴다.
  width: 1024,
  height: 768,
  parent: "game-container",
  pixelArt: false, // 이미지 픽셀을 보존할 것인지
  backgroundColor: "#000000",
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
  scene: [Preload],
};

export default new Game(config);
