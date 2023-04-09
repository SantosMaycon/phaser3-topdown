import Phaser from 'phaser';
import config from './config';
import LoadScene from './scenes/Load';
import Level1 from './scenes/Level-1';

new Phaser.Game(
  Object.assign(config, {
    scene: [LoadScene, Level1]
  })
);
