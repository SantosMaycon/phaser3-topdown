import Phaser, { GameObjects } from 'phaser';
import { Player } from "./../classes/Player";

export default class Level1 extends Phaser.Scene {
  private king!: Player;

  constructor() {
    super('Level1Scene');
  }

  create() {
    this.king = new Player(this, 50, 50, 450);
  }

  update(time: number, delta: number) {
    this.king.update();
  }
}
