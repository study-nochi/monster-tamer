import { Scene } from "phaser";
import { ATTACK_KEYS } from "./attack-keys";
import { exhaustiveGuard } from "../../utils/guard";
import { IceShard } from "./ice-shard";
import { Slash } from "./slash";

export enum ATTACK_TARGET {
  PLAYER = "PLAYER",
  ENEMY = "ENEMY",
}

export class AttackManager {
  _scene: Scene;
  _skipBattleAnimations: boolean;

  #iceShardAttack: IceShard;
  #slashAttack: Slash;

  constructor(scene: Scene, skipBattleAnimations: boolean) {
    this._scene = scene;
    this._skipBattleAnimations = skipBattleAnimations;
  }

  playAttackAnimation(
    attack: ATTACK_KEYS,
    target: ATTACK_TARGET,
    callback: () => void
  ) {
    if (this._skipBattleAnimations) {
      callback();
      return;
    }

    // if attack target is enemy
    let x = 745;
    let y = 140;

    if (target === ATTACK_TARGET.PLAYER) {
      x = 200;
      y = 250;
    }

    switch (attack) {
      case ATTACK_KEYS.ICE_SHARD:
        if (!this.#iceShardAttack) {
          this.#iceShardAttack = new IceShard(this._scene, { x, y });
        }

        this.#iceShardAttack.gameObject?.setPosition(x, y);
        this.#iceShardAttack.playAnimation(callback);
        break;
      case ATTACK_KEYS.SLASH:
        if (!this.#slashAttack) {
          this.#slashAttack = new Slash(this._scene, { x, y });
        }

        this.#slashAttack.gameObject?.setPosition(x, y);
        this.#slashAttack.playAnimation(callback);
        break;
      default:
        exhaustiveGuard(attack);
    }
  }
}
