import Phaser, { GameObjects, Tilemaps } from 'phaser';
import { Player } from './../classes/Player';
import { createLayer } from './../utils/CreateLayer' 
import { debugDraw } from './../utils/Debug' 

export default class Level1 extends Phaser.Scene {
  private king!: Player;

  constructor() {
    super('Level1Scene');
  }

  create() {
    this.king = new Player(this, 150, 155, 200);
    this.king.depth = 2;
  
    const map = this.make.tilemap({ key: 'dungeon' });
    const tileset = map.addTilesetImage('dungeon', 'tiles');

   const ground = createLayer(map, tileset, 'Ground', 0, 2, false);
   const walls = createLayer(map, tileset, 'Walls', 1, 2, true);

    this.physics.add.collider(this.king, walls);
  
    debugDraw(walls, this);

    this.cameras.main.startFollow(this.king, true);
  }

  update(time: number, delta: number) {
    this.king.update();
  }
}
