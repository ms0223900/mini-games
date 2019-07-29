
import { 
  checkPlayerCollideWithPlatform,
  getFrictionAx
} from './gameFn'
import { simpleCheckObjCollide } from '../game/gameFunc'

const springJump = (player, spring) => {
  const springWithHitbox = {
    ...spring,
    spec: spring.hitboxSpec
  }
  //enter spring
  if(checkPlayerCollideWithPlatform(player, springWithHitbox)) {
    player.isInSpring = true
    player.setProp('movement', {
      ...player.movement,
      vy: 6
    })
    player.isInAir && player.setProp('isInAir', false)
  }
  const playerNext = {
    spec: {
      ...player.spec,
      x: player.x + player.movement.vx,
      y: player.y + player.movement.vy,
    }
  }
  //in spring
  if(player.isInSpring && simpleCheckObjCollide(playerNext, springWithHitbox)) {
    //
    player.setProp('movement', {
      ...player.movement,
      ax: getFrictionAx(player.movement.vx, 0.2),
      ay: -1
    })
    //update spring img
    const playerBottom = playerNext.spec.y + player.height
    const springBottom = spring.y + spring.height
    spring.setProp('y', playerBottom)
    spring.setProp('height', springBottom - playerBottom)
  //outside spring 
  } else if(player.isInSpring && !simpleCheckObjCollide(player, springWithHitbox)) {
    player.isInSpring = false
    player.setProp('movement', {
      ...player.movement,
      ax: 0,
      ay: 0,
    })
    spring.setProp('y', spring.hitboxSpec.y)
    spring.setProp('height', spring.hitboxSpec.h)
  }
}

export default springJump