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
    
    if (pad) {
      this.getBody().setVelocityX(pad.leftStick.x * this.velocity);
      this.getBody().setVelocityY(pad.leftStick.y * this.velocity);
    }

    const diagonalFactor = 0.7; // fator de multiplicação para a velocidade diagonal
    
    if (this.keyW?.isDown) {
      this.body.velocity.y = -this.velocity;
      if (this.keyA?.isDown || this.keyD?.isDown) {
        this.body.velocity.y *= diagonalFactor;
      }
    }
    if (this.keyA?.isDown) {
      this.body.velocity.x = -this.velocity;
      if (this.keyW?.isDown || this.keyS?.isDown) {
        this.body.velocity.x *= diagonalFactor;
      }
      this.checkFlip();
      this.getBody().offset.x = 32;
    }
    if (this.keyS?.isDown) {
      this.body.velocity.y = this.velocity;
      if (this.keyA?.isDown || this.keyD?.isDown) {
        this.body.velocity.y *= diagonalFactor;
      }
    }
    if (this.keyD?.isDown) {
      this.body.velocity.x = this.velocity;
      if (this.keyW?.isDown || this.keyS?.isDown) {
        this.body.velocity.x *= diagonalFactor;
      }
      this.checkFlip();
      this.getBody().offset.x = 13;
    }
  }
}
