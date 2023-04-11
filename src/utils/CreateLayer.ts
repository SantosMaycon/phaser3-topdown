import Phaser from 'phaser'

export const createLayer = (
  map: Phaser.Tilemaps.Tilemap,
  tileset: Phaser.Tilemaps.Tileset,
  label: string | number,
  deph: number,
  scale: number,
  collider: boolean
) => {
  const layer = map.createLayer(label, tileset)
  layer.setDepth(deph)
  layer.scale = scale

  if (collider) layer.setCollisionByProperty({ collides: true })

  return layer
}
