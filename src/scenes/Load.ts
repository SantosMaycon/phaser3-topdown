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

    this.load.image({
      key: 'tiles',
      url: 'tilemaps/tiles/dungeon-16-16.png'
    });
    
    this.load.tilemapTiledJSON('dungeon', 'tilemaps/json/dungeon.json');

    this.load.spritesheet('tiles_spr', 'tilemaps/tiles/dungeon-16-16.png', {
      frameWidth: 16,
      frameHeight: 16
    });
  }

  create() {
    this.scene.start('Level1Scene');
  }
}
