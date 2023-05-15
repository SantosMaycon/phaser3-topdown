import { Input } from "phaser";
import { Actor } from "./Actor";
import { Text } from "./Text";
import { EVENTS_NAME, GameStatus } from "../utils/Consts";
import VirtualJoystick from 'phaser3-rex-plugins/plugins/virtualjoystick.js';

const DIRECTION = {
  'UP': 270,
  'RIGHT': 0,
  'DOWN': 90,
  'LEFT': 180,
  // DIAGONAL
  'UP_RIGHT': 315,
  'UP_LEFT': 230,
  'DOWN_RIGHT': 45,
  'DOWN_LEFT': 135 
}


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

  private attackSprite!: Phaser.GameObjects.Sprite;
  private attackArea!: Phaser.GameObjects.Arc;
  public attackRadius = 25;

  private angleDirection = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, velocity: number) {
    super(scene, x, y, 'knight_f');

    this.gamepad = this.scene.input.gamepad;

    this.keyW = this.scene.input.keyboard.addKey('W');
    this.keyA = this.scene.input.keyboard.addKey('A');
    this.keyS = this.scene.input.keyboard.addKey('S');
    this.keyD = this.scene.input.keyboard.addKey('D');

    const width = this.width - 5;
    const height = this.height - 23;

    this.getBody().setSize(width, height);
    this.getBody().setOffset(4, 23);

    this.velocity = velocity;

    this.anims.play('idle');
    this.hp = 100;

    this.keySpace = this.scene.input.keyboard.addKey(32);

    setTimeout(() => {
      this.hpValue = new Text(scene, this.x, this.y - this.height * 0.6, this.hp.toString())
        .setFontSize(12)
        .setOrigin(0.8, 0.5)
        .setDepth(this.depth);
    
      // Attack
      this.attackArea = scene.add.circle(this.x + 50, this.y + 10, this.attackRadius, 0x0000ff, 0);
      this.attackSprite = scene.add.sprite(this.x + 50, this.y + 10, 'attack_effect', 'atack_effect_3').setScale(this.scale);
    
      this.attackSprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE, (animation: any, frame: any) => {
        if (animation.key === 'attack') {
          this.isAttacking = false;
          this.isTouchAttack = false;
        }
      });
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
    this.hpValue?.setPosition(this.x, this.y - this.height);

    if (this.isAttacking) return

    this.getBody().setVelocity(0);
   
    const diagonalFactor = 0.7; // fator de multiplicação para a velocidade diagonal

    if (this.keyW?.isDown || this.joyStick.up) {
      this.body.velocity.y = -this.velocity;
      this.angleDirection = DIRECTION.UP
      if ((this.keyA?.isDown || this.keyD?.isDown) || (this.joyStick.left || this.joyStick.right)) {
        this.body.velocity.y *= diagonalFactor;
        this.angleDirection = (this.keyA?.isDown || this.joyStick.left) ? DIRECTION.UP_LEFT : DIRECTION.UP_RIGHT;
      }
    }
    if (this.keyA?.isDown || this.joyStick.left) {
      this.body.velocity.x = -this.velocity;
      this.angleDirection = DIRECTION.LEFT
      if ((this.keyW?.isDown || this.keyS?.isDown) || (this.joyStick.up || this.joyStick.down)) {
        this.body.velocity.x *= diagonalFactor;
        this.angleDirection = (this.keyW?.isDown || this.joyStick.up) ? DIRECTION.UP_LEFT : DIRECTION.DOWN_LEFT;
      }
    }
    if (this.keyS?.isDown || this.joyStick.down) {
      this.body.velocity.y = this.velocity;
      this.angleDirection = DIRECTION.DOWN
      if ((this.keyA?.isDown || this.keyD?.isDown) || (this.joyStick.left || this.joyStick.right)) {
        this.body.velocity.y *= diagonalFactor;
        this.angleDirection = (this.keyA?.isDown || this.joyStick.left) ? DIRECTION.DOWN_LEFT : DIRECTION.DOWN_RIGHT;
      }
    }
    if (this.keyD?.isDown || this.joyStick.right) {
      this.body.velocity.x = this.velocity;
      this.angleDirection = DIRECTION.RIGHT
      if ((this.keyW?.isDown || this.keyS?.isDown) || (this.joyStick.up || this.joyStick.down)) {
        this.body.velocity.x *= diagonalFactor;
        this.angleDirection = (this.keyW?.isDown || this.joyStick.up) ? DIRECTION.UP_RIGHT : DIRECTION.DOWN_RIGHT;
      }
    }

    if (this.keySpace?.isDown || this.isTouchAttack) {
      this.attackSprite.anims.play('attack')
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

    if(isMoving) {
      this.attackArea?.setPosition(this.x + (Math.sign(this.body.velocity.x) * 50), (this.y + 5) + (Math.sign(this.body.velocity.y) * 50));
      this.attackSprite?.setPosition(this.attackArea.x, this.attackArea.y).setAngle(this.angleDirection);
    }

    if (this.getBody().velocity.x !== 0) {
      var xOffset!: number;
      const direction = Math.sign(this.getBody().velocity.x)

      if (direction === 1) {
        xOffset = 4;
        this.isLookingRight = true;
        this.hpValue?.setOrigin(1, 0.5);
      } else if (direction === -1) {
        xOffset = this.width - 1;
        this.isLookingRight = false;
        this.hpValue?.setOrigin(0, 0.5);
      }

      this.checkFlip();
      if (direction != 0) {
        this.getBody().offset.x = xOffset;
      }
    }
  }
}
