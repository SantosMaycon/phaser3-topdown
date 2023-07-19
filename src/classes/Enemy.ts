import { EVENTS_NAME } from "../utils/Consts";
import { Actor } from "./Actor";
import { Player } from "./Player";

export class Enemy extends Actor {
  private  target: Player;
  private AGRESSOR_RADIUS = 300;
  private attackHandler: () => void;
  private isDestroy = false;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, target: Player, frame?: string | number) {
    super(scene, x, y, texture, frame);

    this.target = target;
    
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.getBody().setSize(16, 16);
    this.getBody().setOffset(1, 0);

    this.setMaxVelocity(Phaser.Math.Between(50, 90));

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
        if (this.body) {
          this.disableBody(true, false);
          this.scene.time.delayedCall(300, () => {
            this.scene.game.events.emit(EVENTS_NAME.spawn);
            this.destroy();
          });
        }
      }
    }

    // EVENTS
    this.scene.game.events.on(EVENTS_NAME.attack, this.attackHandler, this);
    this.scene.game.events.on('destroy', () => {
      this.scene.game.events.removeListener(EVENTS_NAME.attack, this.attackHandler);
    })
  }


  preUpdate(time: number, delta: number) {
    this.getBody().setVelocityX(this.target.x - this.x);
    this.getBody().setVelocityY(this.target.y - this.y);
    this.checkFlip();
    this.getBody().offset.x = Math.sign(this.getBody().velocity.x) === 1 ? 1 : 18;
  }

  public setTarget(target: Player) {
    this.target = target;
  }
}