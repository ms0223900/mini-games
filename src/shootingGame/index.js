import {  
  Game
} from '../game/gameLib'
import {  
  getNewBullet,
  getNewEnemyBullet,
  getNewObstacle,
  myPlayer,
  // enemy01,
  spawnRandomEnemies,
  scoreText,
  healthText,
} from './components'
import {  
  simpleCheckObjCollide
} from '../game/gameFunc'


export class ShootingGame extends Game {
  constructor(canvas, canvasSpec, initGameProp) {
    super(canvas, canvasSpec, initGameProp)
    this.enemyBullets = []
    this.spawnObstacle = setInterval(() => this.spawnObstacleFn(), 3000)
  }
  shootBullet(bulletFn=getNewBullet, obj=myPlayer) {
    this.newGameObjs = [
      ...this.newGameObjs,
      bulletFn(obj.x, obj.y + obj.height / 2, this.gameNewCloneId), 
    ]
    this.gameNewCloneId += 1
    console.log(this.newGameObjs)
  }
  newGameEvent(e) {
    const { keyCode } = e
    if(keyCode === 32) {
      this.shootBullet()
    }
  }
  spawnObstacleFn() {
    this.gameEnemies = [
      ...this.gameEnemies,
      getNewObstacle(this.canvasSpec.width + 300, this.canvasSpec.height - 100, this.gameNewCloneId, 0)
    ]
    this.gameNewCloneId += 1
  }
  spawnEnemyFn() {
    const bulllll = (obj) => {
      this.enemyBullets = [
        ...this.enemyBullets,
        getNewEnemyBullet(obj.x, obj.y + obj.height / 2, this.gameNewCloneId), 
      ]
      this.gameNewCloneId += 1
    }

    console.log(this.gameEnemies)
    const randomPos = {
      x: this.canvasSpec.width + 30,
      y: Math.round( Math.random() * (this.canvasSpec.height - 82) ),
    }
    this.gameEnemies = [
      ...this.gameEnemies,
      spawnRandomEnemies(
        randomPos.x, 
        randomPos.y, 
        this.gameNewCloneId, 
        bulllll,
      ),
    ]
    this.gameNewCloneId += 1
  }
  render() {
    this.ctx.clearRect(0, 0, this.canvasSpec.width, this.canvasSpec.height)
    //
    // this.ctx.beginPath()
    this.drawBG()
    this.drawFPS()

    //game rule
    const removeGameObjs = (objs, _enemy) => {
      this[objs] = this[objs].filter(o => o.cloneId !== _enemy.cloneId)
    }
    const enemyHealthUpdate = (enemy, minusHp=2) => {
      enemy.setProp('health', enemy.health - minusHp)
      enemy.checkIsAlive && enemy.checkIsAlive()
    }
    const checkPlayerHitByTarget = (player, target) => {
      //player hit by target
        if(simpleCheckObjCollide(player, target) && !player.noHurt) {
          console.log('hit!')
          this.gameProp = {
            ...this.gameProp,
            playerLife: this.gameProp.playerLife - 1,
          }
          player.setProp('blinkSpec', {
            ...player.blinkSpec,
            useBlink: true,
          })
          healthText.setProp('health', this.gameProp.playerLife)
          player.setProp('health', this.gameProp.playerLife)
          player.noHurt = true
          player.endNoHurt()
          //
          if(target.type === 'obs') {
            return false
          } return true
        } return false
    }
    //
    this.gameEnemies.forEach(e => {
      //remove enemy if it is out of bound
      if(e.x <= -100 || checkPlayerHitByTarget(myPlayer, e)) {
        removeGameObjs('gameEnemies', e)
        enemyHealthUpdate(e, 10000)
      } else {
        
        e.render(this.ctx)
      }
    })
    this.newGameObjs.forEach(e => {
      //remove bullet if it is out of bound
      if(e.x >= this.canvasSpec.width + 100) {
        removeGameObjs('newGameObjs', e)
      } else {
        e.render(this.ctx)
      }
    })
    this.enemyBullets.forEach(e => {
      //remove enemy if it is out of bound
      if(e.x <= -100 || checkPlayerHitByTarget(myPlayer, e)) {
        removeGameObjs('enemyBullets', e)
      } else {
        e.render(this.ctx)
      }
    })
    myPlayer.render(this.ctx)
    scoreText.render(this.ctx)
    healthText.render(this.ctx)
    //check bullets and ememies
    for (let i = 0; i < this.newGameObjs.length; i++) {
      const OBJ = this.newGameObjs[i]
      //
      for (let j = 0; j < this.gameEnemies.length; j++) {
        const enemy = this.gameEnemies[j]
         // if bullet is collided
        if( simpleCheckObjCollide(OBJ, enemy) ) {
          //update score
          this.gameProp = {
            ...this.gameProp,
            score: typeof(this.gameProp.score) === 'number' ? this.gameProp.score + 100 : 0
          }
          scoreText.setProp('score', this.gameProp.score)
          //update enemy health
          enemyHealthUpdate(enemy)
          //remove collided bullet and enemy
          if(enemy.health <= 0 && enemy.type !== 'obs') {
            removeGameObjs('gameEnemies', enemy)
          }
          removeGameObjs('newGameObjs', OBJ)
        }
      }
    }
    // this.ctx.closePath()

    //animation
    requestAnimationFrame( this.render.bind(this) )
    // if(this.gameProp.playerLife <= 0) {
    //   window.alert('you die~')
    //   clearInterval(this.spawnEnemy)
    // } else {
    //   requestAnimationFrame( this.render.bind(this) )
    // }
    
  }
}
const initGameProp = {
  score: 0,
  playerLife: 10,
}

export const MyGame = (canvas, canvasSpec) => new ShootingGame(canvas, canvasSpec, initGameProp)