import { getVectors, checkLineIntersection, checkPointAtLine, objMoveBaseOnLines } from './gameFn';
import { getReverseArr } from '../functions';

const moveOnSlope = (obj, slope) => {
  const playerSlopePoint = {
    x: obj.x + obj.slopePoint.x,
    y: obj.y + obj.slopePoint.y,
    movement: obj.movement
  }
  const playerSlopePoint_next = { //point B
    x: playerSlopePoint.x + obj.movement.vx,
    y: playerSlopePoint.y + obj.movement.vy,
  }
  const playerSlopePoints = [playerSlopePoint, playerSlopePoint_next]
  const slopeLines = getVectors(slope.pointsForLines)
  //
  for (let i = 0; i < slopeLines.length; i++) {
    const slopeLine = slopeLines[i];
    const res = checkLineIntersection(playerSlopePoints, [slopeLine.A, slopeLine.B])
    const pointLineRes = checkPointAtLine(playerSlopePoint, slopeLine.A, slopeLine.B)
    const slopeMoveNewPos_right = objMoveBaseOnLines(playerSlopePoint, slope.pointsForLines)
    const slopeMoveNewPos_left = objMoveBaseOnLines(playerSlopePoint, getReverseArr(slope.pointsForLines))
    //
    // const pointLineRes_next = checkPointAtLine(playerSlopePoint_next, slopeLine.A, slopeLine.B)
    const setNewPos_rightOrLeft = () => {
      obj.slopePosUpdate_right = slopeMoveNewPos_right
      obj.slopePosUpdate_left = slopeMoveNewPos_left
      obj.setProp('isInAir', false)
      if(!slopeMoveNewPos_right || !slopeMoveNewPos_left) {
        // console.log('falsesss')
        obj.setProp('onSlope', false)
        obj.setProp('isInAir', true)
      }
    }
    //
    const checkPointIsAtPoint = () => {
      for (let i = 0; i < slope.pointsForLines.length; i++) {
        const point = slope.pointsForLines[i];
        if(point.x === playerSlopePoint.x && point.y === playerSlopePoint.y) {
          // window.alert('hi!')
          console.log(playerSlopePoint)
          // obj.setProp('x', obj.x - 20)
          // setNewPos_rightOrLeft()
          return true
        }
      }
    }
    if(checkPointIsAtPoint()) {
      break
    }
    //剛好在末端附近(是onSlope, 但是往左或往右沒有值)
    if((!slopeMoveNewPos_right || !slopeMoveNewPos_left) && obj.onSlope) {
      console.log(obj.x)
      setNewPos_rightOrLeft()
      break
    }
    if((pointLineRes && obj.onSlope)) {
      // console.log(i, 'a')
      // console.log(obj.x + obj.slopePoint.x, obj.y + obj.slopePoint.y, slope.pointsForLines)
      setNewPos_rightOrLeft()
      break 
      //enter the slope area
    } else {
      if(res) {
        // window.alert('collide')
        // console.log(i, 'b')
        obj.setProp('x', res.x - obj.slopePoint.x)
        obj.setProp('y', res.y - obj.slopePoint.y)
        obj.setProp('movement', {
          ...obj.movement,
          vy: 0,
          vx: 0,
          // vx: 0,
        })
        setNewPos_rightOrLeft()
        // console.log(obj.slopePosUpdate_right)
        obj.setProp('isInAir', false)
        obj.setProp('onSlope', true)
        // obj.setProp('useGravity', false)
        break
      }
    }
  }
}
export default moveOnSlope