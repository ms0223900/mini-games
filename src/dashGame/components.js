import { BasicObj, ControllableObj } from '../game/gameLib'

export const PlatForm = (width=80, height=10, x, y, cloneId) => {
  const obj = new BasicObj({
    id: 'platform', cloneId,
    x, y, width, height,
  })
  return obj
}

export const Player = (x, y) => {
  const obj = new ControllableObj({
    x, y, width: 50, height: 50,
    fillStyle: '#0af',
  })
  obj.setProp('movement', {
    ...obj.movement,
    vx: 0,
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

export const myPlayer = moveObj(100, 80, 20, 20)
console.log('dash play: ', myPlayer)
console.log('dash PF01: ', PF01)