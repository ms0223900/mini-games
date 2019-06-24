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
} from './components'
import {  
  simpleCheckObjCollide,
  getVelocity,
  getAngleVelocity,
  getIntervalDeg,
} from '../game/gameFunc'
import { levelConfig } from './levelConfig'
import { getProbability } from '../game/gameFunc'


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



export class ShootingGame extends Game {
  constructor(canvas, canvasSpec, initGameProp) {
    super(canvas, canvasSpec, initGameProp)
    this.enemyBullets = []
    this.newGameObjs = []
    this.buffItems = []
    this.canShootBullet = true
    this.spawnObstacle = setInterval(() => this.spawnObstacleFn(), 3000)
    // this.spawnBossBullets = setInterval(() => this.bossShootBullets(), 1000)
  }
  shootBullet(bulletFn=getNewBullet, obj=myPlayer) {
    myPlayer.bulletBasicV = 10
    const shootDefaultBullet = () => {
      this.newGameObjs = [
        ...this.newGameObjs,
        bulletFn(obj.x, obj.y + obj.height / 2, this.gameNewCloneId),
      ]
    }
    //
    switch (myPlayer.attackType) {
      case 'default': {
        shootDefaultBullet()
        this.gameNewCloneId += 1
        break
      }
      case 'directive': {
        if(this.gameEnemies.length === 0) {
          shootDefaultBullet()
        } else {
          const enemy = this.gameEnemies.filter(e => e.id !== 'obstacle')[0]
          this.newGameObjs = [
            ...this.newGameObjs,
            spawnDirectiveBullet(myPlayer, enemy, myPlayer.bulletBasicV),
          ]
          this.gameNewCloneId += 1
        }
        break
      } 
      case 'spread': {
        console.log(myPlayer)
        spawnSpreadBullets(myPlayer, myPlayer.bulletBasicV, 'right', this, 'newGameObjs')
        break
      }
      default:
        shootDefaultBullet()
    }
    this.canShootBullet = false
    setTimeout(() => { this.canShootBullet = true }, 300)
    // console.log(this.newGameObjs)
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
      this.shootBullet()
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
    const level = this.gameProp.level
    const maxLevel = levelConfig.length - 1
    const thisLevel = levelConfig[level]
    //check amount in this level is fulfilled or not
    if(level < maxLevel && this.gameProp.enemyAmountInThisLevel >= thisLevel.enemyAmount) {
      //update level
      this.gameProp.level += 1
      levelText.setProp('level', levelConfig[this.gameProp.level].level)
      this.gameProp.enemyAmountInThisLevel = 0
      //spawn boss
      this.spawnBoss()
    } else if (!this.gameProp.bossFight) {
      console.log(level)
      //spawn enemy
      const bulllll = (obj) => {
        this.enemyBullets = [
          ...this.enemyBullets,
          getNewEnemyBullet(obj.x, obj.y + obj.height / 2, this.gameNewCloneId), 
        ]
        this.gameNewCloneId += 1
      }
  
      // console.log(this.gameEnemies)
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
          thisLevel.enemyPercent // spawn percentage from levelConfig
        ),
      ]
      this.gameProp.enemyAmountInThisLevel += 1
      this.gameNewCloneId += 1
    }
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
        //set player status
        myPlayer.attackType = e.type
        myPlayer.statusNow = e.type
        myPlayer.timeLimitBuff.buff = 'attack'
        myPlayer.timeLimitBuff.buffTime = 4
        // console.log(myPlayer)
        removeGameObjs('buffItems', e)
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
            this.gameProp = {
              ...this.gameProp,
              score: typeof(this.gameProp.score) === 'number' ? this.gameProp.score + 100 : 0
            }
            scoreText.setProp('score', this.gameProp.score)
            //boss
            if(enemy.id === 'boss') {
              this.gameProp.bossFight = false
            }
            //spawn buff
            if(enemy.id === 'enemy03') {
              this.buffItems = [
                ...this.buffItems,
                getNewBuffItem(enemy.x, enemy.y, this.gameNewCloneId)
              ]
              this.gameNewCloneId += 1
            }
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

export const MyGame = (canvas, canvasSpec) => new ShootingGame(canvas, canvasSpec, initGameProp)