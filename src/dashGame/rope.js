import { simpleCheckObjCollide } from '../game/gameFunc';

const climbRope = (player, rope) => {
  const playerCenter = {
    spec: {
      x: player.x + player.width / 2,
      y: player.y,
      w: 0,
      h: player.height,
    }
  }
  if(simpleCheckObjCollide(playerCenter, rope)) {
    player.attachRope = true
    player.ropePosX = rope.x + rope.width / 2 - player.width / 2
  } else {
    player.attachRope = false
    player.onRope = false
  }
}
export default climbRope