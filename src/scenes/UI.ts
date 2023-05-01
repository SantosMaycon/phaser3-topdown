import { Scene } from "phaser";
import { Score, ScoreOptions } from './../classes/Score'
import { EVENTS_NAME, GameStatus } from "../utils/Consts";
import { Text } from "../classes/Text";

export default class UI extends Scene {
  private score!: Score;
  private chestLootHandler: () => void;

  private gameEndPhrase!: Text;
  private gameEndHandler: (status: GameStatus) => void;

  private totalChest = 0; 
  private totalChestHandler: (value: number) => void;
  
  constructor () {
    super('UIScene');
  
    this.chestLootHandler = () => {
      this.score.changeValue(ScoreOptions.INCREASE, 10);
      if (this.score.getValue() >= this.totalChest && this.totalChest > 0) {
        this.game.events.emit(EVENTS_NAME.gameEnd, GameStatus.WIN);
      }
    }

    this.gameEndHandler = (status) => {
      this.cameras.main.setBackgroundColor('rgba(0,0,0,0.6)');
      this.game.scene.pause('Level1Scene');
      this.gameEndPhrase = new Text(
        this,
        this.game.scale.width / 2,
        this.game.scale.height * 0.4,
        status === GameStatus.LOSE
          ? `WASTED!\nCLICK TO RESTART`
          : `YOU ARE ROCK!\nCLICK TO RESTART`,
      )
        .setAlign('center')
        .setColor(status === GameStatus.LOSE ? '#ff0000' : '#ffffff');
      this.gameEndPhrase.setPosition(
        this.game.scale.width / 2 - this.gameEndPhrase.width / 2,
        this.game.scale.height * 0.4,
      );

      this.input.on('pointerdown', () => {
        this.game.events.off(EVENTS_NAME.chestLoot, this.chestLootHandler);
        this.game.events.off(EVENTS_NAME.gameEnd, this.gameEndHandler);
        this.scene.get('Level1Scene').scene.restart();
        this.scene.restart();
      });
    };

    this.totalChestHandler = (value) => {
      this.totalChest += value;
    }
  }

  create() {
    this.score = new Score(this, 20, 20, 0);
  
    this.initListeners();
  }

  private initListeners() {
    this.game.events.on(EVENTS_NAME.chestLoot, this.chestLootHandler, this);
    this.game.events.on(EVENTS_NAME.totalChest, this.totalChestHandler, this);
    this.game.events.once(EVENTS_NAME.gameEnd, this.gameEndHandler, this);
  }

  update(): void {
    if (this.gameEndPhrase) {
      this.gameEndPhrase.setPosition(
        this.game.scale.width / 2 - this.gameEndPhrase.width / 2,
        this.game.scale.height * 0.4,
      );
    }
  }
}