import { Coordinate } from "../types";

export const ENEMY_POSITION: Coordinate = Object.freeze({ x: 768, y: 144 });
export const PLAYER_POSITION: Coordinate = Object.freeze({ x: 256, y: 316 });

export const BATTLE_STATES = {
  INTRO: "INTRO",
  PRE_BATTLE_INFO: "PRE_BATTLE_INFO",
  BRING_OUT_MONSTER: "BRING_OUT_MONSTER",
  PLAYER_INPUT: "PLAYER_INPUT",
  ENEMY_INPUT: "ENEMY_INPUT",
  BATTLE: "BATTLE",
  POST_ATTACK_CHECK: "POST_ATTACK_CHECK",
  FINISHED: "FINISHED",
  FLEE_ATTEMPT: "FLEE_ATTEMPT",
};
