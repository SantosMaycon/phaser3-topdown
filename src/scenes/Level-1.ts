import Phaser, { GameObjects, Tilemaps } from 'phaser';
import { Player } from './../classes/Player';
import { createLayer } from './../utils/CreateLayer' 
import { debugDraw } from './../utils/Debug' 
import { gameObjectsToObjectPoints } from '../helpers/gameobject-to-object-point';
import { EVENTS_NAME } from '../utils/Consts';

export default class Level1 extends Phaser.Scene {
  private king!: Player;
  private map!: Tilemaps.Tilemap;
  private chests!: Phaser.GameObjects.Sprite[];

  constructor() {
    super('Level1Scene');
  }

  create() {
    this.king = new Player(this, 150, 155, 200);
    this.king.depth = 2;

    this.initMap();
    this.initChests();
    
    this.cameras.main.startFollow(this.king, true,  0.09, 0.09);
  }

  update(time: number, delta: number) {
    this.king.update();
  }

  private initMap() {
    this.map = this.make.tilemap({ key: 'dungeon' });
    const tileset = this.map.addTilesetImage('dungeon', 'tiles');

    const ground = createLayer(this.map, tileset, 'Ground', 0, 2, false);
    const walls = createLayer(this.map, tileset, 'Walls', 1, 2, true);

    this.physics.add.collider(this.king, walls,);
  
    // debugDraw(walls, this);
  }

  private initChests() {
    const chestPoints = gameObjectsToObjectPoints(
      this.map.filterObjects('Chests', x => x.name === 'ChestPoint')
    );
    
    this.chests = chestPoints.map( 
      point => this.physics.add.sprite(point.x * 2, point.y * 2, 'tiles_spr', 595).setScale(1.5).setScale(2)
    );

    this.chests.forEach(chest => {
      this.physics.add.overlap(this.king, chest, (king, chest) => {
        this.game.events.emit(EVENTS_NAME.chestLoot);
        chest.destroy();
        this.cameras.main.flash();
      })
    });
  }
}
