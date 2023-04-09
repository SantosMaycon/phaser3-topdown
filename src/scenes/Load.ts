import Phaser, { GameObjects } from 'phaser';

export default class Load extends Phaser.Scene {
  private king!: GameObjects.Sprite;

  constructor() {
    super('LoadScene');
  }

  preload() {
    this.load.setBaseURL('assets/');
    this.load.image('king', 'sprites/king.png');
  }

  create() {
    this.scene.start('Level1Scene');
  }
}
