import Phaser, { GameObjects, Tilemaps } from 'phaser';
import { Player } from './../classes/Player';
import { createLayer } from './../utils/CreateLayer' 
import { debugDraw } from './../utils/Debug' 
import { gameObjectsToObjectPoints } from '../helpers/gameobject-to-object-point';
import { EVENTS_NAME } from '../utils/Consts';
import { Enemy } from '../classes/Enemy';

const SCALE = 3;
const SCALE_MAP = 3;

export default class Level1 extends Phaser.Scene {
  private king!: Player;
  private map!: Tilemaps.Tilemap;
  private enemies!: Enemy[];
  private walls!: Tilemaps.TilemapLayer;
  private spawnPoints?: { x: number, y: number, radius: number }[] = [];
  private level = 1;

  constructor() {
    super('Level1Scene');
  }

  create() {
    this.input.addPointer(2);

    this.king = new Player(this, 330 * SCALE, 180 * SCALE, 200)
                      .setDepth(2)
                      .setScale(SCALE);


    this.initMap();
    this.initSpawns();
    
    this.cameras.main.startFollow(this.king, true,  0.09, 0.09);
  }

  update(time: number, delta: number) {
    this.king.update();
  }

  private initMap() {
    this.map = this.make.tilemap({ key: 'dungeon' });
    const tileset = this.map.addTilesetImage('dungeon', 'tiles');

    createLayer(this.map, tileset, 'Foreground', 3, SCALE_MAP, false);
    const ground = createLayer(this.map, tileset, 'Ground', 0, SCALE_MAP, false);
    this.walls = createLayer(this.map, tileset, 'Walls', 1, SCALE_MAP, true);

    this.physics.add.collider(this.king, this.walls);
  
    // debugDraw(walls, this);
  }

  private initSpawns() {
    const points = gameObjectsToObjectPoints(
      this.map.filterObjects('Spawns', (x) => x.name === 'SpawnPoint')
    )
      
    points.forEach((spawnPoint) => {
      this.spawnPoints?.push({ 
        x: spawnPoint.x * SCALE_MAP,
        y: spawnPoint.y * SCALE_MAP,
        radius: 125
      });
    })

    if (this.spawnPoints) {
      this.initEnemies();
    }
  }

  private initEnemies() {
    this.enemies = this.spawnPoints!.map((enemyPoint, index) => {
      const point = this.getRandomPositionInRadius(enemyPoint.x, enemyPoint.y, enemyPoint.radius);
      return new Enemy(this, point.x, point.y, 'tiles_spr', this.king, 503)
      .setName(this.level + index.toString()).setScale(SCALE);
    })


    this.physics.add.collider(this.enemies, this.walls);
    this.physics.add.collider(this.enemies, this.enemies);
    this.physics.add.collider(this.king, this.enemies, (obj1, obj2) => {
      (obj1 as Player).getDamage(1);
    });
  }

  private getRandomPositionInRadius(x: number, y: number, radius: number) {
    const angle = Math.random() * Math.PI * 2; 
    const distance = Math.random() * radius; 

    const offsetX = Math.cos(angle) * distance;
    const offsetY = Math.sin(angle) * distance;

    const positionX = x + offsetX;
    const positionY = y + offsetY;
    console.log(positionX, positionY);
    
    return { x: positionX, y: positionY };
  }
}
