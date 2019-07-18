/* eslint-disable no-unused-vars */
import {  
  Game
} from './shootingGameLib'
import {  
  getNewBullet,
  getNewEnemyBullet,
  enemies,
  getNewDirectiveBullet,
  getNewObstacle,
  getNewBuffItem,
  myPlayer,
  player,
  // enemy01,
  spawnRandomEnemies,
  boss,
  scoreText,
  healthText,
  levelText,
  coinText,
  waveText,
  //
  heart,
  coin,
  loopBack,
  playerHeartsUI,
  gameBossLifeUI,
} from './components'
import {  
  simpleCheckObjCollide,
  getVelocity,
  getAngleVelocity,
  getIntervalDeg,
  getProbability,
  getSingleProbability, 
  getSpreadObjs,
  getRandNum,
} from '../game/gameFunc'
import { 
  levelConfig,
  getInfiniteLevel,
  uiImages, 
  bossHealth,
} from './levelConfig'
import { 
  setUIcoinNow,
  setShopUI, 
  setGameOverUI,
} from './gamePopupUI'
import { spawnEnemy, spawnSingleEnemy } from './enemies'
import { shootBullet } from './player'

const initGameProp = {
  level: 0, // array seq, display is level 1
  score: 0,
  coin: 0,
  playerLife: 10,
  playerLifeLimit: 10,
  isNoHurtMode: false,
  enemyAmountInThisLevel: 0,
  bossFight: false,
  isPause: false,
}

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
    // setGameOverUI(this, 'restartGame')
    // this.spawnBossBullets = setInterval(() => this.bossShootBullets(), 1000)
  }
  bossShootBullets() {
    if(this.gameProp.bossFight) {
      const boss = this.gameEnemies.filter(en => en.id === 'boss')
      if(boss.length > 0) {
        const obj = boss[0]
        const basicV = 10
        console.log(obj.attackTime)

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
        const spawnSpreadBullets = (OBJ=obj, bulletsCount=5, startDeg=150) => { //start from 150
          console.log(OBJ.y)
          const degInterval = getIntervalDeg(90, startDeg, bulletsCount)
          for (let i = 0; i < bulletsCount; i++) {
            const degNow = startDeg + i * degInterval
            const v = getAngleVelocity(degNow, basicV)
            this.enemyBullets = [
              ...this.enemyBullets,
              getNewDirectiveBullet(
                OBJ,
                v.vx,
                v.vy, 
                this.gameNewCloneId + i,
                'directive',
                degNow,
              ), 
            ]
          }
          // console.log(this.enemyBullets)
          this.gameNewCloneId += bulletsCount
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
        //
        const spawnSpacingBullets = () => {
          const bulletCount = 6
          const skipPosIndex = getRandNum(bulletCount) // 0 ~ 6
          for (let i = 0; i < bulletCount; i++) {
            const posY = i * 75 //interval is 75
            if(i === skipPosIndex) {
              continue
            }
            this.enemyBullets = [
              ...this.enemyBullets,
              getNewBullet(
                obj.x, 
                posY, 
                this.gameNewCloneId + i, 
                'spacingBullet',
                -5,
                0
              ), 
            ]
          }
          this.gameNewCloneId += bulletCount
        }
        //
        const spawnDelayMultiBullets = () => { //攻擊頻率？
          const bulletCount = 7
          for (let i = 0; i < bulletCount; i++) {
            this.enemyBullets = [
              ...this.enemyBullets,
              getNewBullet(
                260 * (i + 6), //x interval is 135 (90 * 1.5)
                i * 75,  //y interval is 135 (90 * 1.5)
                this.gameNewCloneId + i, 
                'spacingBullet',
                -5,
                0
              ), 
            ]
          }
          this.gameNewCloneId += bulletCount
        }
        //time lag
        const spawnTimeLagBullets = () => {
          //copy boss of that time
          const OBJ = { ...obj, }
          const fn = spawnSpreadBullets.bind(this, OBJ, 6, 144)
          spawnSpreadBullets()
          setTimeout(fn, 500) //timeout 時間差和攻擊頻率??
        }
        //
        const spawnEnemyBullet = () => { spawnSingleEnemy(this, enemies[2]) }
        //random spawn bullets
        const bulletFns = [spawnDirectiveBullet, spawnSpreadBullets, spawnMissileBullet, spawnEnemyBullet, spawnSpacingBullets, spawnDelayMultiBullets, spawnTimeLagBullets]
        const bulletProbability = [0., 0., 0., 0., 0.5, 0.5, 1] //maybe differ from different boss
        //next attack is executed after each time
        const bulletTimeIntervals = [1500, 1500, 1500, 1500, 2000, 3500, 2500, ]
        const bulletRand = getProbability(bulletProbability)
        bulletFns[bulletRand]()
        console.log(bulletFns[bulletRand])
        //change time of attack
        clearInterval(obj.timerAttack)
        obj.attackTime = bulletTimeIntervals[bulletRand]
        obj.timerAttack = obj.timerAttackInit()
      }
    }
  }
  newGameKeyUpEvent(e) {
    myPlayer.removeKeyCode(e)
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
    gameBossLifeUI.display = true //boss health display
    gameBossLifeUI.setProp('bossHealthNow', bossHealth)
    this.gameProp.bossFight = true
    const fn = () => { this.bossShootBullets() }
    this.gameEnemies = [
      ...this.gameEnemies,
      boss(700, 300, this.gameNewCloneId, fn),
    ]
    // console.log(this.gameEnemies)
    this.gameNewCloneId += 1
  }
  displayWaveText() {
    //display and update game level at the same time
    this.updateGameProp('level', this.gameProp.level + 1)
    waveText.setProp('display', true)
    // this.gameProp.isPause = true
    clearGameAllObjs(this, this.eliminateEnemy)
    // this.render()
    this.gameProp.enemyAmountInThisLevel = 0
    setTimeout(() => {
      console.log('timeout')
      waveText.setProp('display', false)
      this.startGame()
    }, 2000)
  }
  startGame() {
    this.gameProp.isPause = false
    this.render()
    this.spawnObstacle = setInterval(() => this.spawnObstacleFn(), 3000)
    this.spawnEnemy = this.spawnEnemyInterval()
  }
  toNextLevel() {
    if((this.gameProp.level + 1) % 3 === 0) { //lv 3, lv 6...
      this.spawnBoss()
    } else {
      this.displayWaveText()
    }
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
  //
  eliminateEnemy = (e) => {
    this.removeGameObjs('gameEnemies', e)
    this.enemyHealthUpdate(e, 10000)
    this.gameProp.enemyAmountInThisLevel += 1
  }
  removeGameObjs = (objs, _enemy) => {
    this[objs] = this[objs].filter(o => o.cloneId !== _enemy.cloneId)
  }
  enemyHealthUpdate = (enemy, minusHp=2) => {
    const newHp = enemy.health - minusHp
    enemy.setProp('health', newHp)
    if(enemy.id === 'boss') {
      gameBossLifeUI.setProp('bossHealthNow', newHp)
      gameBossLifeUI.setProp('hurtHealth', minusHp)
      console.log(newHp, gameBossLifeUI.bossHealthNow)
    }
    enemy.checkIsAlive && enemy.checkIsAlive()
  }
  restartGame() {
    gameBossLifeUI.display = false
    this.updateGameProp('playerLife', 10)
    this.updateGameProp('playerLifeLimit', 10)
    this.updateGameProp('score', 0)
    this.updateGameProp('level', 0)
    this.updateGameProp('coin', 0)
    this.gameProp = initGameProp
    clearGameAllObjs(this, this.eliminateEnemy)
    // myPlayer.reset()
    myPlayer.__proto__.constructor = myPlayer
    console.log(myPlayer)
    this.startGame()
    console.log(this.gameProp)
  }
  //
  render() {
    this.ctx.clearRect(0, 0, this.canvasSpec.width, this.canvasSpec.height)
    //
    // this.ctx.beginPath()
    this.drawBG()
    this.drawFPS()

    //game rule
    const checkGameIsOver = () => {
      if(this.gameProp.playerLife <= 0) {
        this.gameProp.isPause = true
        setGameOverUI(this, 'restartGame', this.gameProp.score)
      }
    }
    checkGameIsOver()
    //remove obj if it is out of bound
    const checkIsOutOfBounding = (e) => (
      e.x <= -100 || 
      // e.x >= this.canvasSpec.width + 100 ||
      e.y <= -100 || 
      e.y >= this.canvasSpec.height + 100
    )
    const checkPlayerHitByTarget = (player, target) => {
      //player hit by target
      if(simpleCheckObjCollide(player, target) && !player.noHurt) {
        // console.log('hit!')
        //update game prop
        if(this.gameProp.isNoHurtMode) { return }
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
      //if collide with player
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
          case 'coin': {
            this.updateGameProp('coin', this.gameProp.coin + 10)
            break
          }
          default:
            break;
        }
        this.removeGameObjs('buffItems', e)
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
        this.removeGameObjs('newGameObjs', e)
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
        this.removeGameObjs('enemyBullets', e)
        // console.log(myPlayer)
      } else {
        missileRedirect()
        e.render(this.ctx)
      }
    })
    //after bullets render
    this.gameEnemies.forEach(e => {
      //remove enemy if it is out of bound
      if((e.x <= -100 || checkPlayerHitByTarget(myPlayer, e)) && e.id !== 'boss') {
        this.eliminateEnemy(e)
      } else {
        e.render(this.ctx)
      }
    })

    //render non destroied obj
    myPlayer.render(this.ctx)
    scoreText.render(this.ctx)
    healthText.render(this.ctx)
    levelText.render(this.ctx)
    coinText.render(this.ctx)
    waveText.render(this.ctx)
    loopBack.render(this.ctx)
    playerHeartsUI.render(this.ctx)
    gameBossLifeUI.render(this.ctx)
    //
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
          this.enemyHealthUpdate(enemy)
          //if enemy die, remove collided bullet and enemy
          if(enemy.health <= 0 && enemy.type !== 'obs') {
            this.removeGameObjs('gameEnemies', enemy)
            //update score
            this.updateGameProp('score', this.gameProp.score + 100)
            //boss is defeated
            if(enemy.id === 'boss') {
              gameBossLifeUI.display = false
              this.gameProp.bossFight = false
              //update level
              // this.gameProp.level += 1
              // levelText.setProp('level', getInfiniteLevel(this.gameProp.level).level)
              //pause the game //when boss is die
              this.gameProp.isPause = true
              clearGameAllObjs(this, this.eliminateEnemy)
              this.render()
              setTimeout(() => { popUpShopUI(this) }, 1000)
            }
            //
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
          this.removeGameObjs('newGameObjs', OBJ)
        }
        //
      }
    }
    // this.ctx.closePath()

    //animation
    // console.log(this.gameEnemies)
    if(!this.gameProp.isPause) {
      requestAnimationFrame( this.render.bind(this) )
    }
    // if(this.gameProp.playerLife <= 0) {
    //   window.alert('you die~')
    //   clearInterval(this.spawnEnemy)
    // } else {
    //   requestAnimationFrame( this.render.bind(this) )
    // }
    
  }
}

const clearGameAllObjs = (gameInstance, removeEnemiesFn) => {
  gameInstance.gameEnemies.forEach(e => {
    removeEnemiesFn(e)
  })
  gameInstance.enemyBullets = []
  gameInstance.newGameObjs = []
  gameInstance.buffItems = []
  gameInstance.gameProp.isPause = true
  clearInterval(gameInstance.spawnEnemy)
  clearInterval(gameInstance.spawnObstacle)
}


const popUpShopUI = (gameInstance, removeEnemiesFn) => {
  //all objects remained on screen clear?
  // clearGameAllObjs(gameInstance, removeEnemiesFn)
  //popup UI
  // buyItemFunctions
  const checkCoinIsEnough = (price, fn) => () => {
    if(gameInstance.gameProp.coin >= price) {
      gameInstance.updateGameProp('coin', gameInstance.gameProp.coin - price)
      fn()
      //refresh coin text
      setUIcoinNow(gameInstance.gameProp.coin)
    } else {
      window.alert('your coins is not enough~')
    }
  }
  const prices = [50, 30, 40] //upgrade prices
  const playerLifeUpLimit = () => {
    gameInstance.gameProp.playerLifeLimit += 1
    gameInstance.updateGameProp('playerLife', gameInstance.gameProp.playerLifeLimit)
    gameInstance.updateGameProp('playerLifeLimit', gameInstance.gameProp.playerLifeLimit)
    window.alert('Your life limit now is: ' + gameInstance.gameProp.playerLifeLimit)
  }
  const bulletsSpeedUp = () => {
    myPlayer.attackFrequency -= 100 //minus 100ms
    window.alert('Your attack speed is up!')
  }
  const playerSpeedUp = () => {
    myPlayer.movement.vStandard += 1
    window.alert('Your move is faster!')
  }
  const buyFns = [
    playerLifeUpLimit,
    bulletsSpeedUp,
    playerSpeedUp,
  ].map((fn, i) => checkCoinIsEnough(prices[i], fn))
  //
  const continueGame = () => {
    gameInstance.spawnEnemy = gameInstance.spawnEnemyInterval()
    gameInstance.setGameProp('isPause', false)
    gameInstance.render()
    gameInstance.displayWaveText()
  }
  setShopUI(buyFns, prices, continueGame, gameInstance.gameProp.coin)
}

export const MyGame = (canvas, canvasSpec) => {
  const game = new ShootingGame(canvas, canvasSpec, initGameProp)
  game
    .addPropToSync(healthText, 'health', 'playerLife')
    .addPropToSync(myPlayer, 'health', 'playerLife')
    .addPropToSync(playerHeartsUI, 'playerLife', 'playerLife')
    .addPropToSync(playerHeartsUI, 'lifeLimit', 'playerLifeLimit')
    .addPropToSync(scoreText, 'score', 'score')
    .addPropToSync(levelText, 'level', 'level')
    .addPropToSync(waveText, 'wave', 'level')
    .addPropToSync(coinText, 'coin', 'coin')
  return game
}