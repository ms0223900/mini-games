export const checkPlayerCollideWithPlatform = (player, obj) => {
  const { x, y, w, h } = player.spec
  const { vx, vy } = player.movement
  const { x: x2, y: y2, w: w2 } = obj.spec
  const points = {
    playerA: { x, y: y + h },
    playerB: { x: x + w, y: y + h },
    playerA_next: { x: x + vx, y: y + vy + h },
    playerB_next: { x: x + vx + w, y: y + vy + h },
    objA: { x: x2, y: y2 }, //point of obj at A
    objB: { x: x2 + w2, y: y2 },
  }
  //
  if(points.playerB_next.x >= points.objA.x && points.playerA_next.x <= points.objB.x) {
    if(points.playerA.y < points.objA.y && points.playerA_next.y >= points.objA.y) {
      return true
    }
    return false
  } 
  return false
}