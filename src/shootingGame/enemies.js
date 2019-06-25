import { levelConfig } from './levelConfig'
import { levelText } from './components'
import { 
  getNewEnemyBullet,
  spawnRandomEnemies,
} from './components'

//enemy functions

export const spawnEnemy = (gameInstance) => {
  const level = gameInstance.gameProp.level
  const maxLevel = levelConfig.length - 1
  const thisLevel = levelConfig[level]
  //check amount in gameInstance level is fulfilled or not
  if(level < maxLevel && gameInstance.gameProp.enemyAmountInThisLevel >= thisLevel.enemyAmount) {
    //update level
    gameInstance.gameProp.level += 1
    levelText.setProp('level', levelConfig[gameInstance.gameProp.level].level)
    gameInstance.gameProp.enemyAmountInThisLevel = 0
    //spawn boss
    gameInstance.spawnBoss()
  } else if (!gameInstance.gameProp.bossFight) {
    console.log(level)
    //spawn enemy
    const bulllll = (obj) => {
      gameInstance.enemyBullets = [
        ...gameInstance.enemyBullets,
        getNewEnemyBullet(obj.x, obj.y + obj.height / 2, gameInstance.gameNewCloneId), 
      ]
      gameInstance.gameNewCloneId += 1
    }
    // console.log(gameInstance.gameEnemies)
    const randomPos = {
      x: gameInstance.canvasSpec.width + 30,
      y: Math.round( Math.random() * (gameInstance.canvasSpec.height - 82) ),
    }
    gameInstance.gameEnemies = [
      ...gameInstance.gameEnemies,
      spawnRandomEnemies(
        randomPos.x, 
        randomPos.y, 
        gameInstance.gameNewCloneId, 
        bulllll,
        thisLevel.enemyPercent // spawn percentage from levelConfig
      ),
    ]
    gameInstance.gameProp.enemyAmountInThisLevel += 1
    gameInstance.gameNewCloneId += 1
  }
}