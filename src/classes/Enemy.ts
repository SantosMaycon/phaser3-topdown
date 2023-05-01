import { EVENTS_NAME } from "../utils/Consts";
import { Actor } from "./Actor";
import { Player } from "./Player";

export class Enemy extends Actor {
  private  target: Player;
  private AGRESSOR_RADIUS = 100;
  private attackHandler: () => void;
  private isDestroy = false;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, target: Player, frame?: string | number) {
    super(scene, x, y, texture, frame);

    this.target = target;
    
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.getBody().setSize(16, 16);
    this.getBody().setOffset(1, 0);

    this.attackHandler = () => {
      if (this.isDestroy) return ;

      if (
        Phaser.Math.Distance.BetweenPoints(
          { x: this.x, y: this.y },
          this.target.getAttackArea(),
        ) < this.target.attackRadius * 1.5
      ) {
        this.isDestroy = true;
        this.getDamage();
        this.disableBody(true, false);
        this.scene.time.delayedCall(300, () => {
          this.destroy();
        });
      }
    }

    // EVENTS
    this.scene.game.events.on(EVENTS_NAME.attack, this.attackHandler, this);
    this.scene.game.events.on('destroy', () => {
      this.scene.game.events.removeListener(EVENTS_NAME.attack, this.attackHandler);
    })
  }


  preUpdate(time: number, delta: number) {
    if (
      Phaser.Math.Distance.BetweenPoints(
        { x: this.x, y: this.y },
        { x: this.target.x, y: this.target.y}
      ) < this.AGRESSOR_RADIUS
      ) {
        this.getBody().setVelocityX(this.target.x - this.x);
        this.getBody().setVelocityY(this.target.y - this.y);
        
        this.checkFlip();

        this.getBody().offset.x = Math.sign(this.getBody().velocity.x) === 1 ? 1 : 18;
    } else {
      this.getBody().setVelocity(0);
    }
  }

  public setTarget(target: Player) {
    this.target = target;
  }
}