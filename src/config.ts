import Phaser from 'phaser';

export default {
  title: 'Phaser Game Tutorial',
  type: Phaser.WEBGL,
  parent: 'game',
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.RESIZE,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  render: {
    antialiasGL: false,
    pixelArt: true,
  },
} as Phaser.Types.Core.GameConfig;
