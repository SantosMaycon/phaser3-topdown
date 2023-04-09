import Phaser, { GameObjects } from 'phaser';

export default class Level1 extends Phaser.Scene {
  private king!: GameObjects.Sprite;

  constructor() {
    super('Level1Scene');
  }

  preload() {}

  create() {
    this.king = this.add.sprite(50, 50, 'king');
  }
}
