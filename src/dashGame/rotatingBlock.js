import { 
  checkLineIntersection,
  getObjAllSidesLine,
} from './gameFn'
import { getDeg } from '../game/gameFunc'

const detectRotatingBlock = (player, block) => {
  const { x, y, height, width } = block
  //check collide
  const deg = block.rotate
  //rotatedBlockPoints(from top left)
  const degCos = getDeg(deg, 'x')
  const degSin = getDeg(deg, 'y')

  const rotatedBlockPoint_A = { x, y }
  const rotatedBlockPoint_B = {
    x: x + degCos * width, 
    y: y + degSin * width,
  }
  const rotatedBlockPoint_C = {
    x: rotatedBlockPoint_B.x - degSin * height,
    y: rotatedBlockPoint_B.y + degCos * height,
  }
  const rotatedBlockPoint_D = {
    x: rotatedBlockPoint_C.x - degCos * width,
    y: rotatedBlockPoint_C.y - degSin * width,
  }
  //
  const rotatedBlockLine_Top = [
    rotatedBlockPoint_A, rotatedBlockPoint_B
  ]
  const rotatedBlockLine_Right = [
    rotatedBlockPoint_B, rotatedBlockPoint_C
  ]
  const rotatedBlockLine_Bottom = [
    rotatedBlockPoint_C, rotatedBlockPoint_D
  ]
  const rotatedBlockLines = [
    rotatedBlockLine_Top, rotatedBlockLine_Right, rotatedBlockLine_Bottom
  ]
  const playerAllSidesLine = getObjAllSidesLine(player)

  block.setProp('fillStyle', '#a00')
  for (let i = 0; i < playerAllSidesLine.length; i++) {
    const playerLine = playerAllSidesLine[i]
    for (let j = 0; j < rotatedBlockLines.length; j++) {
      const line = rotatedBlockLines[j];
      if(checkLineIntersection(playerLine, line)) {
        block.setProp('fillStyle', '#aaa')
        break
      }
    }
  }
}
export default detectRotatingBlock