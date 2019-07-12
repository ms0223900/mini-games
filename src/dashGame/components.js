import { BasicObj, ControllableObj } from '../game/gameLib'
import { canvasSpec } from '../config'

export const PlatForm = (width=80, height=10, x, y, cloneId) => {
  const obj = new BasicObj({
    id: 'platform', cloneId,
    x, y, width, height,
    fillStyle: '#0af',
  })
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
export const ground = PlatForm(10000, 10, 0, canvasSpec.height - 10)
export const PFs = [PF01, PF02, PF03, PF04, PF05, PF06, ground]
//
export const WB01 = WallBlock(100, 100, 100, 300)
export const WB02 = WallBlock(100, 100, 200, 400)
export const WB03 = WallBlock(100, 300, 670, 300)
export const WB04 = WallBlock(100, 300, 800, 200)
export const WBs = [WB01, WB02, WB03, WB04]

// export const myPlayer = moveObj(100, 40, 190, 10)
export const myPlayer = Player(100, 10)
console.log('dash play: ', myPlayer)
console.log('dash PF01: ', PF01)