import { 
  BasicObj, 
  BasicStaticImgObj,
  Triangle,
  PolyLine,
  ControllableObj ,
  Ball,
} from '../game/gameLib'
import { canvasSpec } from '../config'
import SpringImage from '../images/spring.png'
import arrowIcon from '../images/arrowIcon.jpg'

export const PlatForm = (width=80, height=10, x, y, cloneId) => {
  const obj = new BasicObj({
    id: 'platform', cloneId,
    x, y, width, height,
    fillStyle: '#0af',
  })
  return obj
}

export const SpeedUpPlatform = (width, height, x, y, speedUp, cloneId) => {
  const obj = new BasicStaticImgObj({
    id: 'speedUpPlatform', cloneId,
    x, y, width, height,
    fillStyle: '#dd0',
    imgSrc: arrowIcon
  })
  obj.speedUp = speedUp
  obj.dev = true
  return obj
}

//horizontal moving platform(only x changed)
export const MovingObjWonder = (width=80, height=10, x, y, cloneId, moveTo, moveVx=6, moveVy=0, useGravity=false, type='default') => {
  const obj = new BasicObj({
    id: 'movingObj', cloneId, type,
    x, y, width, height,
    fillStyle: '#a0f',
    useGravity,
  })
  obj.MPSpec = {
    isPause: false,
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
    const { isPause, dirNow, movePos, moveFrom, moveTo, moveVx } = obj.MPSpec
    // console.log(movePos)
    if(!isPause) {
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
    
    // console.log(movePos)
  }

  obj.newBehavior = [...obj.newBehavior, moveBF]
  return obj
}
export const NormalMovingObj = (x, y, width=80, height=80, vBasic=5, cloneId=0, isWonderOnPlatform=true) => {
  const obj = new BasicStaticImgObj({
    id: 'normalMovingObj', x, y,
    width, height, cloneId,
    fillStyle: '#6d4c41'
  })
  obj.setProp('dev', true)
  obj.setProp('movement', {
    ...obj.movement,
    isMove: true,
    vBasic,
  })
  obj.setProp('isWonderOnPlatform', true)
  isWonderOnPlatform && obj.setProp('wonderingPlatform', null) //string
  obj.setProp('useGravity', true)
  return obj
}

//

export const TimeoutDropPlatform = (x, y, time, cloneId=10, width=60, height=20) => {
  const obj = new BasicStaticImgObj({
    id: 'dropPlatform', cloneId,
    x, y, 
    width, height,
    fillStyle: '#9a0',
  })
  obj.prevProps = {
    ...obj.prevProps,
    x, 
    y,
  }
  obj.useGravity = false
  obj.dev = true
  obj.dropTime = {
    isOnDrop: false,
    timeNow: 0,
    maxTime: time,
    timer: null
  }
  obj.movement = {
    ...obj.movement,
    vx: 0,
    vy: 0,
  }
  return obj
}

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

export const SlopeLines = (x, y, cloneId) => {
  const obj = new PolyLine({
    id: 'slopeLines', cloneId,
    x, y,
    strokeStyle: '#111',
  })
  return obj
}

export const PlayerAttackHitbox = (x, y, width=40, height=40) => {
  const obj = new BasicObj({
    id: 'attackHitbox', x, y,
    width, height,
    fillStyle: '#da0',
  })
  return obj
}

export const Player = (x, y, width=60, height=100) => {
  const obj = new ControllableObj({
    id: 'player',
    x, y, width, height,
    fillStyle: '#0afadd',
  })
  obj.setProp('movement', {
    ...obj.movement,
    isMove: true,
    vStandard: 5,
    vx: 0,
    vy: 6,
  })
  obj.setProp('dev', true)
  obj.setProp('wall', {
    ...obj.wall,
    useWall: true,
    useBounce: false,
  })
  obj.slopePoint = {
    x: width * 0.8,
    y: height ,
  }
  obj.attackHitbox = PlayerAttackHitbox(x + width, y + 30)
  obj.attackHitbox.setProp('display', false)
  const syncHitboxPos = (obj) => {
    if(obj.direction === 'right') {
      obj.attackHitbox.setProp('x', obj.x + obj.width)
    } else {
      obj.attackHitbox.setProp('x', obj.x - obj.attackHitbox.width)
    }
    obj.attackHitbox.setProp('y', obj.y + 30)
  }
  obj.newBehavior = [
    ...obj.newBehavior,
    syncHitboxPos
  ]
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

export const ball = (x=120, y=300, r=10) => {
  const obj = new Ball({
    id: 'ball', x, y, r,
    fillStyle: '#0aa',
  })
  obj.setProp('movement', {
    ...obj.movement,
    vBasic: 2,
  })
  obj.initPos = { x, y }
  return obj
}

export const Rope = (x, y, height) => {
  const obj = new BasicObj({
    id: 'rope',
    x, y, width: 20, height,
    fillStyle: '#fa0',
  })
  return obj
}

export const Spring = (x, y, width=100, height=100) => {
  const obj = new BasicStaticImgObj({
    id: 'spring', x, y,
    width, height,
    fillStyle: '#489621',
    imgSrc: SpringImage
  })
  obj.dev = true
  return obj
}

export const RotatingLongBlock = (x, y, width=80, height=20) => {
  const obj = new BasicStaticImgObj({
    id: 'rotatingLB', x, y,
    width, height,
    fillStyle: '#a00',
  })
  obj.dev = true
  // obj.rotate = 20
  const rotate = (obj) => {
    obj.setProp('rotate', obj.rotate + 1)
  }
  obj.newBehavior = [...obj.newBehavior, rotate]
  return obj
}

export const PF01 = PlatForm(80, 10, 100, 150)
export const PF02 = PlatForm(80, 10, 150, 200)
export const PF03 = PlatForm(80, 10, 200, 300)
export const PF04 = PlatForm(80, 10, 250, 350)
export const PF05 = PlatForm(80, 10, 300, 400)
export const PF06 = PlatForm(80, 10, 500, 450)
export const PF07 = PlatForm(800, 200, 1290, 410)
export const MPF01 = MovingObjWonder(100, 20, 300, 300, 0, 460, 2)
export const MPF02 = MovingObjWonder(100, 20, 600, 100, 1, 400, 0, 2)
export const TDPF01 = TimeoutDropPlatform(350, 250, 1000)
export const ground = PlatForm(10000, 10, 0, canvasSpec.height - 10)
export const PFs = [PF01, PF02, PF03, PF04, PF05, PF06, PF07, ground, MPF01, MPF02, TDPF01]
console.log(MPF02)
//

export const WB01 = WallBlock(100, 100, 100, 300)
export const WB02 = WallBlock(100, 100, 200, 400)
export const WB03 = WallBlock(100, 300, 670, 300)
export const WB04 = WallBlock(100, 300, 800, 200)
export const WB05 = WallBlock(800, 200, 900, 510)
export const WB06 = WallBlock(800, 200, 1120, 470)
export const WBs = [WB01, WB02, WB03, WB04, WB05]

export const S01 = Slope(100, 100, 1200, 420)
export const SL01 = SlopeLines(100, 100)
export const SL02 = SlopeLines(900, 200)
export const B01 = ball(100 + 120, 100 + 300)
export const Slopes = [SL02]
// console.log(S01)

export const R01 = Rope(350, 400, 100)
export const Ropes = [R01]

export const Spr01 = Spring(1000, 400)
export const Springs = [Spr01]

export const SUP01 = SpeedUpPlatform(200, 20, 1400, 350, 3, 0)
export const SpeedupPlatforms = [SUP01]

export const RLB01 = RotatingLongBlock(300, 200)
export const RotatingLBs = [RLB01]

// export const TimeoutDropPFs = [TDPF01]

// export const myPlayer = moveObj(100, 40, 190, 10)
export const myPlayer = Player(200, 200)
export const playerAttackHitbox = PlayerAttackHitbox(100, 100)
//

export const Enemy01 = MovingObjWonder(40, 40, 1400, 370, 0, 1700, 3, 0, false, 'enemy')
export const Enemy02 = NormalMovingObj(1400, 100, 60, 60, 4, 0)
export const Enemies = [Enemy01, Enemy02]
console.log(Enemy01)
console.log('dash play: ', myPlayer)
console.log('dash PF01: ', PF01)