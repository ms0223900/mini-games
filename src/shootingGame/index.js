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
  coinText,
  heart,
  coin,
  loopBack,
} from './components'
import {  
  simpleCheckObjCollide,
  getVelocity,
  getAngleVelocity,
  getIntervalDeg,
} from '../game/gameFunc'
import { 
  levelConfig,
  uiImages, 
} from './levelConfig'
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

//
let UI
window.onload = () => {
  UI = document.getElementById('UI')
  // setUI()
  console.log(UI)
}
//set UI
const setUIcoinNow = (coinNow) => {
  document.getElementById('coinNow').innerText = coinNow
}
export const setUI = (buyItemFn, itemPrices, setGameContinueFn, coinNow) => {
  UI.style.display = 'block'
  const newContainer = document.getElementsByClassName('ui-container')[0]
  setUIcoinNow(coinNow)
  while(newContainer.firstChild) {
    newContainer.removeChild(newContainer.firstChild)
  }
  // newContainer.setAttribute('class', 'ui-container')
  //
  for (let i = 0; i < uiImages.length; i++) {
    const image = uiImages[i]
    const newImageContainer = document.createElement('div')
    newImageContainer.setAttribute('class', 'image-container')
    const imageEl = document.createElement('img')
    imageEl.setAttribute('src', image)
    const title = document.createElement('h3')
    title.textContent = `$ ${ itemPrices[i] }`
    newImageContainer.appendChild(imageEl)
    newImageContainer.appendChild(title)
    newContainer.appendChild(newImageContainer)
    // document.getElementsByClassName('image-container')[i].onclick = () => window.alert('aa')
  }
  const imageContainers = document.getElementsByClassName('image-container')
  for (let i = 0; i < imageContainers.length; i++) {
    const el = imageContainers[i]
    el.addEventListener('click', buyItemFn[i])
  }
  document.getElementById('continueBTN').addEventListener('click', () => {
    setGameContinueFn()
    UI.style.display = 'none'
  })
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
  eliminateEnemy() {
    
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
    const eleminateEnemy = (e) => {
      removeGameObjs('gameEnemies', e)
      enemyHealthUpdate(e, 10000)
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
        eleminateEnemy(e)
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
    loopBack.render(this.ctx)
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
          enemyHealthUpdate(enemy)
          //if enemy die, remove collided bullet and enemy
          if(enemy.health <= 0 && enemy.type !== 'obs') {
            removeGameObjs('gameEnemies', enemy)
            //update score
            this.updateGameProp('score', this.gameProp.score + 100)
            //boss is defeated
            if(enemy.id === 'boss') {
              this.gameProp.bossFight = false
              //update level
              this.gameProp.level += 1
              levelText.setProp('level', levelConfig[this.gameProp.level].level)
              this.gameProp.enemyAmountInThisLevel = 0
              //pause the game //when boss is die and level value is 1 
              if(this.gameProp.level === 1) {
                //////
                popUpShopUI(this, eleminateEnemy)
              }
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
          removeGameObjs('newGameObjs', OBJ)
        }
        //
      }
    }
    // this.ctx.closePath()

    //animation
    console.log(this.gameEnemies)
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

const popUpShopUI = (gameInstance, removeEnemiesFn) => {
  //all objects remained on screen clear?
  gameInstance.gameEnemies.forEach(e => {
    removeEnemiesFn(e)
  })
  gameInstance.newGameObjs = []
  gameInstance.buffItems = []
  gameInstance.gameProp.isPause = true
  clearInterval(gameInstance.spawnEnemy)
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
    gameInstance.gameProp.isPause = false
    gameInstance.render()
    gameInstance.spawnEnemy = gameInstance.spawnEnemyInterval()
  }
  setUI(buyFns, prices, continueGame, gameInstance.gameProp.coin)
}

const initGameProp = {
  level: 0, // array seq, display is level 1
  score: 0,
  coin: 0,
  playerLife: 10,
  playerLifeLimit: 10,
  enemyAmountInThisLevel: 0,
  bossFight: false,
  isPause: false,
}

export const MyGame = (canvas, canvasSpec) => {
  const game = new ShootingGame(canvas, canvasSpec, initGameProp)
  game
    .addPropToSync(healthText, 'health', 'playerLife')
    .addPropToSync(myPlayer, 'health', 'playerLife')
    .addPropToSync(scoreText, 'score', 'score')
    .addPropToSync(levelText, 'level', 'level')
    .addPropToSync(coinText, 'coin', 'coin')
  return game
}