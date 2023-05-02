import { Input } from "phaser";
import { Actor } from "./Actor";
import { Text } from "./Text";
import { EVENTS_NAME, GameStatus } from "../utils/Consts";
import VirtualJoystick from 'phaser3-rex-plugins/plugins/virtualjoystick.js';


export class Player extends Actor {
  private joyStick!: VirtualJoystick;
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
  private isTouchAttack = false

  private attackArea!: Phaser.GameObjects.Arc
  public attackRadius = 25;

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
        this.isTouchAttack = false;
      }
    });

    setTimeout(() => {
      this.hpValue = new Text(scene, this.x, this.y - this.height * 0.6, this.hp.toString())
        .setFontSize(12)
        .setOrigin(0.8, 0.5)
        .setDepth(this.depth);
    
      // Attack
      this.attackArea = scene.add.circle(0, 0, this.attackRadius, 0x0000ff, 0);
    }, 0);

    this.on('destroy', () => {
      this.keySpace.removeAllListeners();
    });

    // CONFIG JOY STICK
    this.joyStick = new VirtualJoystick(scene, {
      x: 80,
      y: scene.game.canvas.height - 80,
      radius: 40,
      base: scene.add.circle(0, 0, 40, 0x2a2a2a).setDepth(4),
      thumb: scene.add.circle(0, 0, 20, 0x656565).setDepth(4),
      dir: "8dir", 
      forceMin: 32,
      enable: true,
    });

    if (scene.sys.game.device.os.desktop) {
      this.joyStick.toggleVisible();
    } else {
      scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        if (pointer.isDown) {
          const dist = Phaser.Math.Distance.Between(
            pointer.x,
            pointer.y,
            this.joyStick.x,
            this.joyStick.y
          );
          if (dist > 40) {
            // o toque está fora do joystick virtual
            // faça algo aqui, como mover o jogador
            this.isTouchAttack = true; 
          }
        }
      });
    }

    scene.scale.on('resize', (gameSize: Phaser.Structs.Size, baseSize: Phaser.Structs.Size, displaySize: Phaser.Structs.Size, resolution: number) => {
      this.joyStick.setPosition(80, scene.game.canvas.height - 80);
    }, scene);
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

    if (this.keyW?.isDown || this.joyStick.up) {
      this.body.velocity.y = -this.velocity;
      if ((this.keyA?.isDown || this.keyD?.isDown) || (this.joyStick.left || this.joyStick.right)) {
        this.body.velocity.y *= diagonalFactor;
      }
    }
    if (this.keyA?.isDown || this.joyStick.left) {
      this.body.velocity.x = -this.velocity;
      if ((this.keyW?.isDown || this.keyS?.isDown) || (this.joyStick.up || this.joyStick.down)) {
        this.body.velocity.x *= diagonalFactor;
      }
    }
    if (this.keyS?.isDown || this.joyStick.down) {
      this.body.velocity.y = this.velocity;
      if ((this.keyA?.isDown || this.keyD?.isDown) || (this.joyStick.left || this.joyStick.right)) {
        this.body.velocity.y *= diagonalFactor;
      }
    }
    if (this.keyD?.isDown || this.joyStick.right) {
      this.body.velocity.x = this.velocity;
      if ((this.keyW?.isDown || this.keyS?.isDown) || (this.joyStick.up || this.joyStick.down)) {
        this.body.velocity.x *= diagonalFactor;
      }
    }

    if (this.keySpace?.isDown || this.isTouchAttack) {
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
