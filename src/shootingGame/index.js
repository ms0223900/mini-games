/* eslint-disable no-unused-vars */
import {  
  Game
} from '../game/gameLib'
import {  
  getNewBullet,
  getNewEnemyBullet,
  getNewDirectiveBullet,
  getNewObstacle,
  getNewBuffItem,
  myPlayer,
  // enemy01,
  spawnRandomEnemies,
  boss,
  scoreText,
  healthText,
  levelText,
  heart,
  coin,
} from './components'
import {  
  simpleCheckObjCollide,
  getVelocity,
  getAngleVelocity,
  getIntervalDeg,
} from '../game/gameFunc'
import { levelConfig } from './levelConfig'
import { 
  getProbability,
  getSingleProbability, 
  getSpreadObjs,
} from '../game/gameFunc'
import { spawnEnemy } from './enemies'
import { shootBullet } from './player'

const spawnObj = (gameInstance, originObjs, newObj) => {
  gameInstance[originObjs] = [
    ...gameInstance.buffItems,
    newObj
  ]
  gameInstance.gameNewCloneId += 1
}





export class ShootingGame extends Game {
  constructor(canvas, canvasSpec, initGameProp) {
    super(canvas, canvasSpec, initGameProp)
    this.enemyBullets = []
    this.newGameObjs = []
    this.buffItems = []
    this.canShootBullet = true
    this.gamePropToSync = {}
    this.spawnObstacle = setInterval(() => this.spawnObstacleFn(), 3000)
    // this.spawnBossBullets = setInterval(() => this.bossShootBullets(), 1000)
  }
  bossShootBullets() {
    if(this.gameProp.bossFight) {
      const boss = this.gameEnemies.filter(en => en.id === 'boss')
      if(boss.length > 0) {
        const obj = boss[0]
        const basicV = 10

        //single directive bullet
        const spawnDirectiveBullet = () => {
          const v = getVelocity(obj, myPlayer, basicV)
          this.enemyBullets = [
            ...this.enemyBullets,
            getNewDirectiveBullet(
              obj,
              v.vx,
              v.vy, 
              this.gameNewCloneId,
              'directive',
              v.deg,
            ), 
          ]
          this.gameNewCloneId += 1
        }
        //multi spread bullets
        const spawnSpreadBullets = () => {
          const bulletsCount = 5 // deg from 150
          const startDeg = 150
          const degInterval = getIntervalDeg(90, startDeg, bulletsCount)
          for (let i = 0; i < bulletsCount; i++) {
            const degNow = startDeg + i * degInterval
            const v = getAngleVelocity(degNow, basicV)
            this.enemyBullets = [
              ...this.enemyBullets,
              getNewDirectiveBullet(
                obj,
                v.vx,
                v.vy, 
                this.gameNewCloneId + i,
                'directive',
                degNow,
              ), 
            ]
          }
          console.log(this.enemyBullets)
          this.gameNewCloneId += 5
        }
        //missile
        const spawnMissileBullet = () => {
          const v = getVelocity(obj, myPlayer, basicV)
          const newBullet = getNewDirectiveBullet(
            obj,
            v.vx,
            v.vy, 
            this.gameNewCloneId,
            'missile'
          )
          newBullet.isMissile = true
          this.enemyBullets = [
            ...this.enemyBullets,
            newBullet, 
          ]
          setTimeout(() => { newBullet.isMissile = false }, 1000)
          this.gameNewCloneId += 1
        }
        //random spawn bullets
        const bulletFns = [spawnDirectiveBullet, spawnSpreadBullets, spawnMissileBullet]
        const bulletProbability = [0.7, 0.3, 0] //maybe differ from different boss
        const bulletRand = getProbability(bulletProbability)
        bulletFns[bulletRand]()
      }
    }
  }
  newGameEvent(e) {
    const { keyCode } = e
    if(keyCode === 32 && this.canShootBullet) {
      // this.shootBullet()
      shootBullet(this)
    }
    myPlayer.moveByUser(e)
  }
  spawnObstacleFn() {
    const randZoomRatio = (~~(Math.random() * 6) + 5) / 10
    this.gameEnemies = [
      ...this.gameEnemies,
      getNewObstacle(this.canvasSpec.width + 300, this.canvasSpec.height - 100, this.gameNewCloneId, 0, randZoomRatio)
    ]
    this.gameNewCloneId += 1
  }
  spawnBoss() {
    this.gameProp.bossFight = true
    const fn = () => { this.bossShootBullets() }
    this.gameEnemies = [
      ...this.gameEnemies,
      boss(700, 300, this.gameNewCloneId, fn),
    ]
    // console.log(this.gameEnemies)
    this.gameNewCloneId += 1
  }
  spawnEnemyFn() {
    spawnEnemy(this)
  }
  addPropToSync(obj, objProp, gameProp) {
    const originGameProp = this.gamePropToSync[gameProp] || []
    this.gamePropToSync = {
      ...this.gamePropToSync,
      [gameProp]: [
        ...originGameProp,
        { obj, objProp },
      ]
    }
    return this
  }
  updateGameProp(prop, value) {
    this.gameProp = {
      ...this.gameProp,
      [prop]: value,
    }
    this.updatePropByGameProp(prop, value)
  }
  updatePropByGameProp(prop, value) {
    this.gamePropToSync[prop].forEach(gameObj => {
      gameObj.obj.setProp(gameObj.objProp, value)
    })
  }
  render() {
    this.ctx.clearRect(0, 0, this.canvasSpec.width, this.canvasSpec.height)
    //
    // this.ctx.beginPath()
    this.drawBG()
    this.drawFPS()

    //game rule
    
    //remove obj if it is out of bound
    const checkIsOutOfBounding = (e) => (
      e.x <= -100 || e.x >= this.canvasSpec.width + 100 ||
      e.y <= -100 || e.y >= this.canvasSpec.height + 100
    )
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
        // console.log('hit!')
        //update game prop
        this.updateGameProp('playerLife', this.gameProp.playerLife - 1)
        player.setProp('blinkSpec', {
          ...player.blinkSpec,
          useBlink: true,
        })
        //set nohurt  
        player.noHurt = true
        player.endNoHurt()
        //
        if(target.type === 'obs') {
          return false
        } return true
      } return false
    }
    //
    this.buffItems.forEach(e => {
      if(simpleCheckObjCollide(myPlayer, e)) {
        switch (e.id) {
          case 'buff': {
            //set player status
            myPlayer.attackType = e.type
            myPlayer.statusNow = e.type
            myPlayer.timeLimitBuff.buff = 'attack'
            myPlayer.timeLimitBuff.buffTime = 4
            break
          }
          case 'heart': {
            this.updateGameProp('playerLife', this.gameProp.playerLife + 1)
            // console.log(myPlayer)
            break
          }
          default:
            break;
        }
        removeGameObjs('buffItems', e)
      } else {
        if(e.id === 'coin') {
          const v = getVelocity(e, myPlayer, 12)
          e.movement.vx = v.vx
          e.movement.vy = v.vy
        }
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
      const missileRedirect = () => {
        const missiles = this.enemyBullets.filter(en => en.id === 'missile')
        for (let i = 0; i < missiles.length; i++) {
          const el = missiles[i]
          if(el.isMissile) {
            const v = getVelocity(el, myPlayer, el.movement.vBasic || 6)
            el.movement = {
              ...el.movement,
              vx: v.vx,
              vy: v.vy,
            }
          }
        }
      }
      if(checkIsOutOfBounding(e) || checkPlayerHitByTarget(myPlayer, e)) {
        removeGameObjs('enemyBullets', e)
      } else {
        missileRedirect()
        e.render(this.ctx)
      }
    })
    //after bullets render
    this.gameEnemies.forEach(e => {
      //remove enemy if it is out of bound
      if((e.x <= -100 || checkPlayerHitByTarget(myPlayer, e)) && e.id !== 'boss') {
        removeGameObjs('gameEnemies', e)
        enemyHealthUpdate(e, 10000)
      } else {
        e.render(this.ctx)
      }
    })
    //render non destroied obj
    myPlayer.render(this.ctx)
    scoreText.render(this.ctx)
    healthText.render(this.ctx)
    levelText.render(this.ctx)
    //check bullets and ememies
    for (let i = 0; i < this.newGameObjs.length; i++) {
      const OBJ = this.newGameObjs[i]
      //
      for (let j = 0; j < this.gameEnemies.length; j++) {
        const enemy = this.gameEnemies[j]
         // if bullet is collided
        if( simpleCheckObjCollide(OBJ, enemy) ) {
          //enemy blink effect
          enemy.setProp('blinkSpec', {
            ...enemy.blinkSpec,
            useBlink: true,
          })
          
          //update enemy health
          enemyHealthUpdate(enemy)
          //if enemy die, remove collided bullet and enemy
          if(enemy.health <= 0 && enemy.type !== 'obs') {
            removeGameObjs('gameEnemies', enemy)
            //update score
            this.updateGameProp('score', this.gameProp.score + 100)
            //boss
            if(enemy.id === 'boss') {
              this.gameProp.bossFight = false
            }
            //spawn buff
            if(enemy.id === 'enemy03') {
              const newBuff = getNewBuffItem(enemy.x, enemy.y, this.gameNewCloneId)
              spawnObj(this, 'buffItems', newBuff)
            }
            if(getSingleProbability(0.1)) {
              const newHeart = heart(enemy.x, enemy.y, this.gameNewCloneId)
              spawnObj(this, 'buffItems', newHeart)
            }
            //money
            getSpreadObjs(enemy, 60, 6).forEach(obj => {
              const newCoin = coin(obj.x, obj.y, this.gameNewCloneId)
              spawnObj(this, 'buffItems', newCoin)
            })
          }
          removeGameObjs('newGameObjs', OBJ)
        }
        //
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
  level: 0, // array seq, display is level 1
  score: 0,
  playerLife: 10,
  enemyAmountInThisLevel: 0,
  bossFight: false,
}

export const MyGame = (canvas, canvasSpec) => {
  const game = new ShootingGame(canvas, canvasSpec, initGameProp)
  game
    .addPropToSync(healthText, 'health', 'playerLife')
    .addPropToSync(myPlayer, 'health', 'playerLife')
    .addPropToSync(scoreText, 'score', 'score')
    .addPropToSync(levelText, 'level', 'level')
  return game
}