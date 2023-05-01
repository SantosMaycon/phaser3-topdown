import { Scene } from "phaser";
import { Score, ScoreOptions } from './../classes/Score'
import { EVENTS_NAME, GameStatus } from "../utils/Consts";
import { Text } from "../classes/Text";

export default class UI extends Scene {
  private score!: Score;
  private chestLootHandler: () => void;

  private gameEndPhrase!: Text;
  private gameEndHandler: (status: GameStatus) => void;
  
  constructor () {
    super('UIScene');
  
    this.chestLootHandler = () => {
      this.score.changeValue(ScoreOptions.INCREASE, 10);
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
    };
  }

  create() {
    this.score = new Score(this, 20, 20, 0);
  
    this.initListeners();
  }

  private initListeners() {
    this.game.events.on(EVENTS_NAME.chestLoot, this.chestLootHandler, this);
    this.game.events.once(EVENTS_NAME.gameEnd, this.gameEndHandler, this);
    this.game.events.on(EVENTS_NAME.gameEnd, () => {
    }, this)
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