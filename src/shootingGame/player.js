import {
   getNewBullet,
   myPlayer, 
   getNewDirectiveBullet,
} from './components'
import {
  getVelocity,
  getIntervalDeg,
  getAngleVelocity,
} from '../game/gameFunc'


//bullet fn
const spawnDirectiveBullet = (obj1, obj2, basicV, cloneId) => {
  const v = getVelocity(obj1, obj2, basicV)
  return getNewDirectiveBullet(
    obj1,v.vx,v.vy, cloneId, 'directive', v.deg
  )
}
//multi spread bullets
const spawnSpreadBullets = (obj, basicV, shootSide='left', gameInstance, bulletsProp='enemyBullets') => {
  const bulletsCount = 5 // deg from 150
  const baseDeg = shootSide === 'left' ? 90 : 270 // base deg
  const startDeg = baseDeg + 60
  const degInterval = getIntervalDeg(baseDeg, startDeg, bulletsCount)
  for (let i = 0; i < bulletsCount; i++) {
    const degNow = startDeg + i * degInterval
    const v = getAngleVelocity(degNow, basicV)
    gameInstance[bulletsProp] = [
      ...gameInstance[bulletsProp],
      getNewDirectiveBullet(
        obj,
        v.vx,
        v.vy, 
        gameInstance.gameNewCloneId + i,
        'directive',
        degNow,
      ), 
    ]
  }
  console.log(gameInstance[bulletsProp])
  gameInstance.gameNewCloneId += 5
}

export const shootBullet = (gameInstance, bulletFn=getNewBullet, obj=myPlayer) => {
  myPlayer.bulletBasicV = 10
  const shootDefaultBullet = () => {
    gameInstance.newGameObjs = [
      ...gameInstance.newGameObjs,
      bulletFn(obj.x, obj.y + obj.height / 2, gameInstance.gameNewCloneId),
    ]
  }
  //
  switch (myPlayer.attackType) {
    case 'default': {
      shootDefaultBullet()
      gameInstance.gameNewCloneId += 1
      break
    }
    case 'directive': {
      if(gameInstance.gameEnemies.length === 0) {
        shootDefaultBullet()
      } else {
        const enemy = gameInstance.gameEnemies.filter(e => e.id !== 'obstacle')[0]
        gameInstance.newGameObjs = [
          ...gameInstance.newGameObjs,
          spawnDirectiveBullet(myPlayer, enemy, myPlayer.bulletBasicV),
        ]
        gameInstance.gameNewCloneId += 1
      }
      break
    } 
    case 'spread': {
      // console.log(myPlayer)
      spawnSpreadBullets(myPlayer, myPlayer.bulletBasicV, 'right', gameInstance, 'newGameObjs')
      break
    }
    default:
      shootDefaultBullet()
  }
  gameInstance.canShootBullet = false
  setTimeout(() => { gameInstance.canShootBullet = true }, myPlayer.attackFrequency)
  // console.log(this.newGameObjs)
}