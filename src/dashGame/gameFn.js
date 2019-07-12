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
  //include complete intersection condition
  if(points.playerB_next.x >= points.objA.x && points.playerA_next.x <= points.objB.x) {
    if(points.playerA.y <= points.objA.y && points.playerA_next.y >= points.objA.y) {
      return true
    }
    return false
  } 
  return false
}

//based on obj1 direction side
export const getABpointsBySide = (obj1, obj2, sideDir='bottom') => {
  const { x, y, w, h } = obj1.spec
  const { vx, vy } = obj1.movement
  const { x: x2, y: y2, w: w2, h: h2 } = obj2.spec
  switch (sideDir) {
    case 'bottom':
      return {
        playerA: { x, y: y + h },
        playerB: { x: x + w, y: y + h },
        playerA_next: { x: x + vx, y: y + vy + h },
        playerB_next: { x: x + vx + w, y: y + vy + h },
        objA: { x: x2, y: y2 }, //point of obj at A
        objB: { x: x2 + w2, y: y2 },
      }
    case 'top':
      return {
        playerA: { x, y },
        playerB: { x: x + w, y },
        playerA_next: { x: x + vx, y: y + vy },
        playerB_next: { x: x + vx + w, y: y + vy },
        objA: { x: x2, y: y2 + h2 }, //point of obj at A
        objB: { x: x2 + w2, y: y2 + h2 },
      }
    case 'left':
      return {
        playerA: { x, y },
        playerB: { x, y: y + h },
        playerA_next: { x: x + vx, y: y + vy },
        playerB_next: { x: x + vx, y: y + vy + h },
        objA: { x: x2 + w2, y: y2 }, //point of obj at A
        objB: { x: x2 + w2, y: y2 + h2 },
      }
    case 'right':
      return {
        playerA: { x: x + w, y },
        playerB: { x: x + w, y: y + h },
        playerA_next: { x: x + vx + w, y: y + vy },
        playerB_next: { x: x + vx + w, y: y + vy + h },
        objA: { x: x2, y: y2 }, //point of obj at A
        objB: { x: x2, y: y2 + h2 },
      }
    default:
      break;
  }
}

export const checkObjCollideWithBlockSide = (player, obj, side='bottom') => {
  const points = getABpointsBySide(player, obj, side)
  //
  //include complete intersection condition
  switch (side) {
    case 'top': 
    case 'bottom': {
      if(points.playerB_next.x >= points.objA.x && points.playerA_next.x <= points.objB.x) {
        if(side === 'bottom') {
          if(points.playerA.y <= points.objA.y && points.playerA_next.y >= points.objA.y) {
            return true
          }
        }
        if(side === 'top') {
          if(points.playerA.y >= points.objA.y && points.playerA_next.y <= points.objA.y) {
            return true
          }
        }
      }
      return false
    }
    case 'left':
    case 'right': {
      if(points.playerB_next.y >= points.objA.y && points.playerA_next.y <= points.objB.y) {
        if(side === 'right') {
          if(points.playerA.x <= points.objA.x && points.playerA_next.x >= points.objA.x) {
            return true
          }
        }
        if(side === 'left') {
          if(points.playerA.x >= points.objA.x && points.playerA_next.x <= points.objA.x) {
            return true
          }
        }
      }
      return false
    }
    default:
      break;
  }
  // 
}

const sides = ['top', 'right', 'bottom', 'left']
export const checkSolidBlockCollide = (player, block) => {
  for (let i = 0; i < sides.length; i++) {
    const res = checkObjCollideWithBlockSide(player, block, sides[i])
    if(res) { return sides[i] }
  } return false
}