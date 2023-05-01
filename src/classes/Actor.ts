import { Physics } from "phaser";

export class Actor extends Physics.Arcade.Sprite {
  protected hp = 100;
  private timeoutId: number | undefined;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  public getDamage(value?: number) {
    this.scene?.tweens.add({
      targets: {},
      x: 0,
      duration: 100,
      repeat: 3,
      yoyo: true,
      onStart: () => {
        this.timeoutId = setTimeout(() => {
          this.setAlpha(0.5);
        }, 0);

        if (value) {
          this.hp = this.hp - value;
        }
      },
      onComplete: () => {
        this.setAlpha(1);
        clearTimeout(this.timeoutId)
      }
    });
    
    this.scene?.tweens.add({
      targets: this,
      duration: 100,
      repeat: 3,
      yoyo: true,
      onStart: () => {
        this.setAlpha(0.5);
        if (value) {
          this.hp = this.hp - value;
        }
      },
      onComplete: () => {
        this.setAlpha(1);
      }
    })
  }

  public getHP(): number {
    return this.hp;
  }

  protected checkFlip() {
    const direction = Math.abs(this.scaleX);
    this.scaleX = this.body.velocity.x < 0 ? -direction : direction;
  }

  protected getBody(): Physics.Arcade.Body {
    return this.body as Physics.Arcade.Body;
  }
}