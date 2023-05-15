import Phaser, { GameObjects } from 'phaser';

export default class Load extends Phaser.Scene {
  constructor() {
    super('LoadScene');
  }

  preload() {
    this.load.setBaseURL('assets/');

    this.load.atlas('knight_f', 'spritesheets/knight_f.png', 'spritesheets/knight_f_atlas.json');
    this.load.animation('knight_f_data', 'spritesheets/knight_f_anim.json');

    this.load.atlas('attack_effect', 'spritesheets/attack_effect.png', 'spritesheets/attack_effect_atlas.json');
    this.load.animation('attack_effect_data', 'spritesheets/attack_effect_anim.json');

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
    this.scene.start('UIScene');
  }
}
