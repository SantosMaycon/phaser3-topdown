import { Physics } from "phaser";

export default class Actor extends Physics.Arcade.Sprite {
  protected hp = 100;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
  }

  public getDamage(value?: number) {
    this.scene.tweens.add({
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
    this.scaleX = this.body.velocity.x < 0 ? -1 : 1;
  }

  protected getBody(): Physics.Arcade.Body {
    return this.body as Physics.Arcade.Body;
  }
}