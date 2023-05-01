import { Input } from "phaser";
import { Actor } from "./Actor";
import { Text } from "./Text";
import { EVENTS_NAME, GameStatus } from "../utils/Consts";

export class Player extends Actor {
  private gamepad!: Phaser.Input.Gamepad.GamepadPlugin;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keySpace!: Input.Keyboard.Key;

  private velocity!: number;

  private hpValue!: Text;

  private isLookingRight = true;
  private isAttacking = false;

  private attackArea!: Phaser.GameObjects.Arc
  public attackRadius = 20;

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
    this.setScale(1.5);

    this.initAnimations();
    this.hp = 100;

    this.keySpace = this.scene.input.keyboard.addKey(32);
    this.on('animationcomplete', (animation: any, frame: any) => {
      if (animation.key === 'attack') {
        this.isAttacking = false;
      }
    });

    setTimeout(() => {
      this.hpValue = new Text(scene, this.x, this.y - this.height * 0.6, this.hp.toString())
        .setFontSize(12)
        .setOrigin(0.8, 0.5);
    
      // Attack
      this.attackArea = scene.add.circle(0, 0, this.attackRadius, 0x0000ff, 0);
    }, 0);

    this.on('destroy', () => {
      this.keySpace.removeAllListeners();
    });
  }

  public getDamage(value?: number) {
    super.getDamage(value);
    this.hpValue.setText(this.hp.toString());
    if (this.hp <= 0) {
      this.scene.game.events.emit(EVENTS_NAME.gameEnd, GameStatus.LOSE);
    }
  }

  public getAttackArea() {
    return { x: this.attackArea?.x, y: this.attackArea?.y }
  }

  update() {
    const attackDirection = this.isLookingRight ? +40 : -40

    this.hpValue?.setPosition(this.x, this.y - this.height * 0.6);
    this.attackArea?.setPosition(this.x + attackDirection, this.y);

    if (this.isAttacking) return

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

    if (this.keySpace?.isDown) {
      this.anims.play('attack', true);
      this.scene.game.events.emit(EVENTS_NAME.attack);
      this.isAttacking = true;
      this.getBody().setVelocity(0);
    } else if (!this.isAttacking) {
      this.updateMovement();
    }

  }

  updateMovement() {
    const isMoving = this.getBody().velocity.x !== 0 || this.getBody().velocity.y !== 0;

    this.anims.play(isMoving ? 'run' : 'idle', true);

    if (this.getBody().velocity.x !== 0) {
      var xOffset!: number;
      const direction = Math.sign(this.getBody().velocity.x)
      

      if (direction === 1) {
        xOffset = 22;
        this.isLookingRight = true;
        this.hpValue?.setOrigin(1, 0.5);
      } else if (direction === -1) {
        xOffset = 42;
        this.isLookingRight = false;
        this.hpValue?.setOrigin(0, 0.5);
      }

      this.checkFlip();
      if (direction != 0) {
        this.getBody().offset.x = xOffset;
      }
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
