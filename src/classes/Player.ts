import { Actor } from "./Actor";

export class Player extends Actor {
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;

  private velocity!: number

  constructor(scene: Phaser.Scene, x: number, y: number, velocity: number) {
    super(scene, x, y, 'king');

    this.keyW = this.scene.input.keyboard.addKey('W');
    this.keyA = this.scene.input.keyboard.addKey('A');
    this.keyS = this.scene.input.keyboard.addKey('S');
    this.keyD = this.scene.input.keyboard.addKey('D');

    this.getBody().setSize(20, 10);
    this.getBody().setOffset(13, 19);

    this.velocity = velocity
  }

  update() {
    this.getBody().setVelocity(0);

    if (this.keyW?.isDown) {
      this.body.velocity.y = -this.velocity;
    }
    if (this.keyA?.isDown) {
      this.body.velocity.x = -this.velocity;
      this.checkFlip();
      this.getBody().offset.x = 32;
    }
    if (this.keyS?.isDown) {
      this.body.velocity.y = this.velocity;
    }
    if (this.keyD?.isDown) {
      this.body.velocity.x = this.velocity;
      this.checkFlip();
      this.getBody().offset.x = 13;
    }
  }
}
