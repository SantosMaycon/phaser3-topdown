import Phaser, { GameObjects, Tilemaps } from 'phaser';
import { Player } from './../classes/Player';
import { createLayer } from './../utils/CreateLayer' 
import { debugDraw } from './../utils/Debug' 
import { gameObjectsToObjectPoints } from '../helpers/gameobject-to-object-point';
import { EVENTS_NAME } from '../utils/Consts';
import { Enemy } from '../classes/Enemy';

export default class Level1 extends Phaser.Scene {
  private king!: Player;
  private map!: Tilemaps.Tilemap;
  private chests!: Phaser.GameObjects.Sprite[];
  private enemies!: Enemy[];
  private walls!: Tilemaps.TilemapLayer;

  constructor() {
    super('Level1Scene');
  }

  create() {
    this.king = new Player(this, 150, 155, 200);
    this.king.depth = 2;

    this.initMap();
    this.initChests();
    this.initEnemies();
    
    this.cameras.main.startFollow(this.king, true,  0.09, 0.09);
  }

  update(time: number, delta: number) {
    this.king.update();
  }

  private initMap() {
    this.map = this.make.tilemap({ key: 'dungeon' });
    const tileset = this.map.addTilesetImage('dungeon', 'tiles');

    const ground = createLayer(this.map, tileset, 'Ground', 0, 2, false);
    this.walls = createLayer(this.map, tileset, 'Walls', 1, 2, true);

    this.physics.add.collider(this.king, this.walls);
  
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

  private initEnemies() {
    const enemiesPoints = gameObjectsToObjectPoints(
      this.map.filterObjects('Enemies', (x) => x.name === 'EnemyPoint')
    )

    this.enemies = enemiesPoints.map((enemyPoint) => {
      return new Enemy(this, enemyPoint.x, enemyPoint.y, 'tiles_spr', this.king, 503)
      .setName(enemyPoint.id.toString())
      .setScale(2);
    })


    this.physics.add.collider(this.enemies, this.walls);
    this.physics.add.collider(this.enemies, this.enemies);
    this.physics.add.collider(this.king, this.enemies, (obj1, obj2) => {
      (obj1 as Player).getDamage(1);
      console.log('Hit');
    });
  }
}
