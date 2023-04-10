import Phaser, { GameObjects } from 'phaser';

export default class Load extends Phaser.Scene {
  private king!: GameObjects.Sprite;

  constructor() {
    super('LoadScene');
  }

  preload() {
    this.load.setBaseURL('assets/');
    this.load.image('king', 'sprites/king.png');
    this.load.atlas('a-king', 'spritesheets/a-king.png', 'spritesheets/a-king_atlas.json');
  }

  create() {
    this.scene.start('Level1Scene');
  }
}
