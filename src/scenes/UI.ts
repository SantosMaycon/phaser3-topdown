import { Scene } from "phaser";
import { Score, ScoreOptions } from './../classes/Score'
import { EVENTS_NAME } from "../utils/Consts";

export default class UI extends Scene {
  private score!: Score;
  private chestLootHandler: () => void;
  
  constructor () {
    super('UIScene');
  
    this.chestLootHandler = () => {
      this.score.changeValue(ScoreOptions.INCREASE, 10);
    }
  }

  create() {
    this.score = new Score(this, 20, 20, 0);
  
    this.initListeners();
  }

  private initListeners() {
    this.game.events.on(EVENTS_NAME.chestLoot, this.chestLootHandler, this);
  }
}