import { 
  BasicObj, 
  Triangle,
  ControllableObj 
} from '../game/gameLib'
import { canvasSpec } from '../config'

export const PlatForm = (width=80, height=10, x, y, cloneId) => {
  const obj = new BasicObj({
    id: 'platform', cloneId,
    x, y, width, height,
    fillStyle: '#0af',
  })
  return obj
}

//horizontal moving platform(only x changed)
export const MovingPlatForm = (width=80, height=10, x, y, cloneId, moveTo, moveVx=6, moveVy=0) => {
  const obj = new BasicObj({
    id: 'movingPlatform', cloneId,
    x, y, width, height,
    fillStyle: '#a0f',
  })
  obj.MPSpec = {
    dirNow: moveVx !== 0 ? 'right' : 'down',
    movePos: moveVx !== 0 ? x : y,
    moveFrom: moveVx !== 0 ? x : y,
    moveTo,
    moveVx,
    moveVy,
  }
  obj.movement = {
    ...obj.movement,
    isMove: true,
    vy: 0,
    ay: 0,
  }
  const moveBF = (obj) => {
    const { dirNow, movePos, moveFrom, moveTo, moveVx } = obj.MPSpec
    // console.log(movePos)
    if(dirNow === 'right' || dirNow === 'down') {
      if(movePos < moveTo) {
        obj.setProp('movement', {
          ...obj.movement,
          vx: moveVx,
          vy: moveVy,
        })
      } else {
        obj.MPSpec.dirNow = dirNow === 'right' ? 'left' : 'up'
      }
    } else if(dirNow === 'left' || dirNow === 'up') {
      if(movePos > moveFrom) {
        // obj.MPSpec.movePos -= moveVx
        obj.setProp('movement', {
          ...obj.movement,
          vx: -moveVx,
          vy: -moveVy,
        })
      } else {
        obj.MPSpec.dirNow = dirNow === 'left' ? 'right' : 'down'
      }
    }
    obj.MPSpec.movePos = 
      (dirNow === 'left' || dirNow === 'right' ) ? obj.x : obj.y
  }
  obj.newBehavior = [...obj.newBehavior, moveBF]
  return obj
}
//

export const WallBlock = (width=80, height=80, x, y, cloneId) => {
  const obj = new BasicObj({
    id: 'wallBlock', cloneId,
    x, y, width, height,
    fillStyle: '#33a',
  })
  return obj
}
//

export const Slope = (width=80, height=80, x, y, cloneId) => {
  const obj = new Triangle({
    id: 'slope', cloneId,
    x, y, width, height,
    fillStyle: '#af0',
  })

  return obj
}

export const Player = (x, y) => {
  const obj = new ControllableObj({
    x, y, width: 60, height: 100,
    fillStyle: '#0af',
  })
  obj.setProp('movement', {
    ...obj.movement,
    isMove: true,
    vx: 0,
    vy: 6,
  })
  obj.setProp('dev', true)
  obj.setProp('wall', {
    ...obj.wall,
    useWall: true,
    useBounce: false,
  })
  return obj
}

export const moveObj = (width=80, height=80, x, y, cloneId) => {
  const obj = new BasicObj({
    id: 'platform', cloneId,
    x, y, width, height,
    fillStyle: '#00f',
  })
  obj.setProp('movement', {
    ...obj.movement,
    isMove: true,
    vx: 0,
    vy: 6,
  })
  obj.setProp('wall', {
    ...obj.wall,
    useWall: true,
  })
  return obj
}


export const PF01 = PlatForm(80, 10, 100, 150)
export const PF02 = PlatForm(80, 10, 150, 200)
export const PF03 = PlatForm(80, 10, 200, 300)
export const PF04 = PlatForm(80, 10, 250, 350)
export const PF05 = PlatForm(80, 10, 300, 400)
export const PF06 = PlatForm(80, 10, 500, 450)
export const PF07 = PlatForm(800, 200, 1290, 410)
export const MPF01 = MovingPlatForm(100, 20, 300, 300, 0, 460, 2)
export const MPF02 = MovingPlatForm(100, 20, 600, 100, 0, 400, 0, 2)
export const ground = PlatForm(10000, 10, 0, canvasSpec.height - 10)
export const PFs = [PF01, PF02, PF03, PF04, PF05, PF06, PF07, ground, MPF01, MPF02]
console.log(MPF02)
//

export const WB01 = WallBlock(100, 100, 100, 300)
export const WB02 = WallBlock(100, 100, 200, 400)
export const WB03 = WallBlock(100, 300, 670, 300)
export const WB04 = WallBlock(100, 300, 800, 200)
export const WB05 = WallBlock(800, 200, 1100, 500)
// export const WB06 = WallBlock(800, 200, 1290, 410)
export const WBs = [WB01, WB02, WB03, WB04, WB05]

export const S01 = Slope(100, 100, 1200, 420)
export const Slopes = [S01]
console.log(S01)

// export const myPlayer = moveObj(100, 40, 190, 10)
export const myPlayer = Player(1200, 200)
console.log('dash play: ', myPlayer)
console.log('dash PF01: ', PF01)