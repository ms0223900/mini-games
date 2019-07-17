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

export const checkLineIntersection = (line1, line2) => {
  const [a, b] = line1;
  const [c, d] = line2;
  const dii = (b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x);
  if (dii === 0) {
    return false;
  }
  const u = ((c.x - a.x) * (d.y - c.y) - (c.y - a.y) * (d.x - c.x)) / dii;
  const v = ((c.x - a.x) * (b.y - a.y) - (c.y - a.y) * (b.x - a.x)) / dii;
  if (v < 0 || u > 1) {
    return false;
  }
  if (v > 1 || u < 0) {
    return false;
  }
  return {
    x: a.x + u * (b.x - a.x),
    y: a.y + u * (b.y - a.y)
  };
};

export const getDistance = (a, b) => (
  Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y))
)

export const getVectors = (points) => {
  const vectors = []
  for (let i = 0; i < points.length - 1; i++) {
    vectors[i] = {
      x: points[i + 1].x - points[i].x,
      y: points[i + 1].y - points[i].y,
      A: { x: points[i].x, y: points[i].y },
      B: { x: points[i + 1].x, y: points[i + 1].y },
    }
  }
  return vectors
}
export const getUnitVector = (vector) => {
  const length = Math.sqrt(vector.x * vector.x + vector.y + vector.y)
  return ({
    x: vector.x / length,
    y: vector.y / length,
  })
}
//fn test ok
export const checkPointAtLine = (point, lineA, lineB) => {
  const checkCrossZero = (point.x - lineA.x) * (lineB.y - lineA.y) === (lineB.x - lineA.x) * (point.y - lineA.y)
  const checkInBoundX = 
    Math.min(lineA.x, lineB.x) <= point.x && Math.max(lineA.x, lineB.x) >= point.x
  const checkInBoundY = 
    Math.min(lineA.y, lineB.y) <= point.y && Math.max(lineA.y, lineB.y) >= point.y
  if(checkCrossZero && checkInBoundX && checkInBoundY) {
    return true
  } return false
}

export const objMoveBaseOnLines = (obj, points) => {
  const { x, y } = obj
  const { vBasic } = obj.movement
  
  const vectors = getVectors(points)
  console.log(vectors)
  //check obj is at which lines
  let onWhichLine
  for (let i = 0; i < vectors.length; i++) {
    const v = vectors[i]
    if(checkPointAtLine(obj, v.A, v.B)) {
      onWhichLine = i
      break
    }
  }
  // console.log(onWhichLine)
  if( typeof(onWhichLine) === 'number' ) {
    console.log(vectors[onWhichLine])
    const unitVector = getUnitVector( vectors[onWhichLine] )
    const newPos = {
      x: x + vBasic * unitVector.x,
      y: y + vBasic * unitVector.y,
    }
    if( checkPointAtLine(newPos, vectors[onWhichLine].A, vectors[onWhichLine].B) ) {
      return newPos
    } else {
      //需增加剛好到線段交點的狀況
      if(onWhichLine + 1 >= vectors.length) { return false }
      const remainV = vBasic - getDistance(obj, vectors[onWhichLine].B)
      const unitNextVector = getUnitVector( vectors[onWhichLine + 1] )
      const newPos = {
        x: vectors[onWhichLine + 1].A.x + remainV * unitNextVector.x,
        y: vectors[onWhichLine + 1].A.y + remainV * unitNextVector.y,
      }
      return newPos
    }
  } else {
    return false
  }
}