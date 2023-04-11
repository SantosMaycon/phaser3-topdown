import { Actor } from "./Actor";

export class Player extends Actor {
  private gamepad!: Phaser.Input.Gamepad.GamepadPlugin;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;

  private velocity!: number;

  constructor(scene: Phaser.Scene, x: number, y: number, velocity: number) {
    super(scene, x, y, 'king');

    this.gamepad = this.scene.input.gamepad;

    this.keyW = this.scene.input.keyboard.addKey('W');
    this.keyA = this.scene.input.keyboard.addKey('A');
    this.keyS = this.scene.input.keyboard.addKey('S');
    this.keyD = this.scene.input.keyboard.addKey('D');

    this.getBody().setSize(20, 10);
    this.getBody().setOffset(22,33);

    this.velocity = velocity;
    this.setScale(2, 2);

    this.initAnimations();
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
    }

    if (this.getBody().velocity.x !== 0 || this.getBody().velocity.y !== 0) {
      this.anims.play('run', true);
      if (Math.sign(this.getBody().velocity.x) === 1) {
        this.checkFlip();
        this.getBody().offset.x = 22;
      }
      else if (Math.sign(this.getBody().velocity.x) === -1) {
        this.checkFlip();
        this.getBody().offset.x = 42;
      } 
    } else {
      this.anims.play('idle', true);
    }
  }


  private initAnimations(): void {
    this.scene.anims.create({
      key: 'idle',
      frames: [{ key: 'a-king', frame: 'run-2'}],
      frameRate: 1,
    });
    this.scene.anims.create({
      key: 'run',
      frames: this.scene.anims.generateFrameNames('a-king', {
        prefix: 'run-',
        end: 7,
      }),
      frameRate: 8,
      repeat: -1
    });
    this.scene.anims.create({
      key: 'attack',
      frames: this.scene.anims.generateFrameNames('a-king', {
        prefix: 'attack-',
        end: 2,
      }),
      frameRate: 8,
    });
	}
}
