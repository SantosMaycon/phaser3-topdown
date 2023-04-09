import { Actor } from "./Actor";

export class Player extends Actor {
  private gamepad!: Phaser.Input.Gamepad.GamepadPlugin;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;

  private velocity!: number

  constructor(scene: Phaser.Scene, x: number, y: number, velocity: number) {
    super(scene, x, y, 'king');

    this.gamepad = this.scene.input.gamepad;

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
    const pad = this.gamepad.getPad(0);

    if (this.keyW?.isDown || pad?.leftStick.y < 0) {
      this.body.velocity.y = -this.velocity;
    } else if (this.keyA?.isDown || pad?.leftStick.x < 0) {
      this.body.velocity.x = -this.velocity;
      this.checkFlip();
      this.getBody().offset.x = 32;
    } else if (this.keyS?.isDown || pad?.leftStick.y > 0) {
      this.body.velocity.y = this.velocity;
    } else if (this.keyD?.isDown || pad?.leftStick.x > 0) {
      this.body.velocity.x = this.velocity;
      this.checkFlip();
      this.getBody().offset.x = 13;
    }
  }
}
