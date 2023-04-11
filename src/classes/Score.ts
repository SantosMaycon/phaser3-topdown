import { Text } from "./Text";

export enum ScoreOptions {
  INCREASE,
  DECREASE,
  SET_VALUE
}

export class Score extends Text {
  private scoreValue: number

  constructor(scene: Phaser.Scene, x: number, y: number, initScore = 0) {
    super(scene, x, y, `Score: ${initScore}`);

    scene.add.existing(this);
    this.scoreValue = initScore;
  }

  public changeValue(operation: ScoreOptions, value: number) {
    switch (operation) {
      case ScoreOptions.INCREASE:
        this.scoreValue += value;
        break;

      case ScoreOptions.DECREASE:
        this.scoreValue -= value;
        break;

      case ScoreOptions.SET_VALUE:
        this.scoreValue = value;
        break;
      default:
        break;
    }

    this.setText(`Score: ${this.scoreValue}`);
  }
}