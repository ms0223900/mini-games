/* eslint-disable no-unused-vars */
import { canvasSpec } from '../config'
import {  
  // BasicObj,
  Enemy,
  Ball,
  BasicText,
  BasicStaticImgObj,
  ControllableObj,
  GroupObjs,
  BasicObj,
} from '../game/gameLib'
import { getProbability, getAngleVelocity } from '../game/gameFunc'
import {  
  bossHealth
} from './levelConfig'
//player
import iconImg from '../images/chick_190624-02.png'
import iconImg02 from '../images/chick_190624-01.png'
import iconImg03 from '../images/iconImg-03.png'
//bullets
import bullet01 from '../images/chick_190624-04.png'
import bullet02 from '../images/chick_190624-03.png'
import bullet03 from '../images/chick_190624-05.png'
//
import monster01 from '../images/monster01.png'
import monster02 from '../images/monster02.png'
import monster03 from '../images/monster03.png'
//
import ground from '../images/ground.png'
import building from '../images/building.png'
import buff01 from '../images/buff01.png'
import heartImg from '../images/heart-icon.png'
import coinImg from '../images/coin-icon.png'
import playerHeartImg from '../images/playerHeart.png'
import playerHeartHalfImg from '../images/playerHeart-half.png'
import playerHeartNoneImg from '../images/playerHeart-none.png'

//custom components
const backGround = () => {
  const amountOfImg = canvasSpec.width / 40 + 1 //image width is 40
  const images = [...Array(amountOfImg).keys()].map(i => (
    new BasicStaticImgObj({
      id: 'ground',
      x: i * 40, y: canvasSpec.height - 30,
      width: 40, height: 128,
      imgSrc: ground,
      movement: {
        isMove: true,
        vx: -5,
        vy: 0,
      }
    })
  ))
  return ({
    position: 0,
    updatePosition() {
      if(this.position === -40) {
        images.forEach(image => {
          image.x += 40
        })
        this.position = 0
      }
    },
    render(ctx) {
      this.updatePosition()
      images.forEach(image => {
        image.render(ctx)
      })
      this.position -= 5
    }
  })
}
export const loopBack = backGround() 


export const heart = (x, y, cloneId) => new BasicStaticImgObj({
  id: 'heart', cloneId,
  x, y, 
  width: 40, height: 40,
  imgSrc: heartImg,
  movement: {
    isMove: true,
    vx: -4,
    vy: 0,
  }
})
export const coin = (x, y, cloneId) => new BasicStaticImgObj({
  id: 'coin', cloneId,
  x, y, 
  width: 20, height: 20,
  imgSrc: coinImg,
  movement: {
    isMove: true,
    vx: -4,
    vy: 0,
  }
})
export const playerHeart = (x, y, cloneId) => {
  const obj = new BasicStaticImgObj({
    id: 'playerHeart', cloneId,
    x, y, 
    width: 30, height: 30,
    playerHeartImg,
  })
  obj.status = {
    default: playerHeartImg,
    half: playerHeartHalfImg,
    none: playerHeartNoneImg,
  }
  return obj
}

const getArr = (num) => num < 0 ? [] : [...Array(num).keys()]

const generatePlayerHeart = (playerLife, lifeLimit) => {
  const totalHearts = Math.ceil(lifeLimit / 2)
  const fullHearts = ~~(playerLife / 2) 
  const halfHearts = playerLife - fullHearts * 2 // 1 or 0
  const noneHearts = totalHearts - fullHearts - halfHearts
  const hearts = [
    ...getArr(fullHearts).map(a => a = 'default'),
    ...getArr(halfHearts).map(a => a = 'half'),
    ...getArr(noneHearts).map(a => a = 'none'),
  ]
  return hearts.map((heart, i) => {
    const obj = playerHeart(30 + i * 36, 30, i)
    obj.statusNow = heart
    return obj
  })
}

const hearts = (playerLife=10, lifeLimit=10) => {
  const updateHearts = (e) => {
    // console.log(e.playerLife, e.lifeLimit)
    e.groupObjs = generatePlayerHeart(e.playerLife, e.lifeLimit)
  }
  const obj = new GroupObjs({
    groupObjs: generatePlayerHeart(playerLife, lifeLimit),
    updateFns: [updateHearts]
  })
  obj.playerLife = playerLife
  obj.lifeLimit = lifeLimit
  return obj
}

export const playerHeartsUI = hearts()
console.log(playerHeartsUI)

//
const newEnemy = ( id='enemy', imgSrc, movement) => (x=300, y=300, cloneId=0, timerAttackFn) => 
new Enemy({ x, y, id, cloneId, type: 'enemy', width: 80, height: 80, imgSrc, movement, timerAttackFn })
//
export const boss = (x=700, y=300, cloneId=0, timerAttackFn, id='boss', imgSrc=monster03, movement) => {
  const b = new Enemy({ x, y, id, cloneId, width: 400, height: 400, imgSrc, movement, timerAttackFn, health: bossHealth, }) 
  //set attack status and img
  b.status = {
    default: imgSrc,
    attack: monster02,
  }
  b.turnDegNow = 0
  return (
    b.setNewMovement((e) => {
      // console.log('call boss move')
      e.movement.isMove = true
      e.upDown = {
        min: -100,
        max: 400,
        isDown: false,
        basicV: 5,
      }
      e.movement.vx = 0
      // e.movement.vy = e.upDown.basicV * -1
      //
      // console.log(e)
      if(e.y <= e.upDown.min && !e.upDown.isDown) {
        e.movement.vx = 0
        e.movement.vy = e.upDown.basicV * 1
        e.upDown.isDown = true
      } else if(e.y >= e.upDown.max) {
        e.movement.vx = 0
        e.movement.vy = e.upDown.basicV * -1
        e.upDown.isDown = false
      }
    })
  )
}
export const bossLifeRect = (id, x=100, width, height, fillStyle='#222') => new BasicObj({
  id, x, y: 100,
  width, height,
  fillStyle,
})
const bossLifeUI = (width=500, height=10) => {
  const UIx = 100
  const UIbg = bossLifeRect('lifeUI_BG', UIx, width, height, '#ccc')
  const mainUI = bossLifeRect('lifeUI_main', UIx, width, height, '#333')
  const hurtUI = bossLifeRect('lifeUI_hurt', UIx + width, 0, height, '#c10000')
  const convertHealthToWidth = (e) => {
    const UIwidth = width * (e.bossHealthNow / e.bossHealthMax)
    const hurtWidth = width * (e.hurtHealth / e.bossHealthMax)
    const main = e.groupObjs.find(obj => obj.id === 'lifeUI_main')
    const hurt = e.groupObjs.find(obj => obj.id === 'lifeUI_hurt')
    main.width = UIwidth
    hurt.x = UIx + UIwidth
    //
    if(e.hurtHealth > 0 && !e.startHurt) {
      e.startHurt = true
      hurt.width = hurtWidth
      // hurt.x = UIx + UIwidth 
    } else if(hurt.width <= 0) {
      e.startHurt = false
      e.hurtHealth = 0
    } else {
      hurt.width -= 1
    }
  }
  const obj = new GroupObjs({
    updateFns: [convertHealthToWidth],
    groupObjs: [UIbg, mainUI, hurtUI]
  })
  obj.bossHealthMax = bossHealth
  obj.bossHealthNow = bossHealth
  obj.hurtHealth = 0
  obj.startHurt = false
  return obj
}
export const gameBossLifeUI = bossLifeUI()


export const enemy01 = newEnemy('enemy01', monster01, { isMove: true, vx: -3, vy: 0, })
export const enemy02 = newEnemy('enemy02', monster02, { isMove: true, vx: -5, vy: 0, })
export const enemy03 = newEnemy('enemy03', monster03, { isMove: true, vx: -7, vy: 0, })

export const spawnRandomEnemies = (x, y, cloneId, timerAttackFn, enemyPercent=[0.33, 0.33, 0.33]) => {
  const enemies = [enemy01, enemy02, enemy03]
  //enemy spawn probability
  const num = getProbability(enemyPercent) || 0
  if(num === 1) {
    return enemies[num](x, y, cloneId, timerAttackFn)
      .setNewMovement((e) => {
        const deg = e.turnDegNow
        const { vx, vy, } = getAngleVelocity(deg, 2)
        e.movement = {
          ...e.movement,
          // vx,
          vy,
        }
        e.turnDegNow += 1.5
      })
  } else {
    return enemies[num](x, y, cloneId, timerAttackFn)
  }
}

//default ball bullet
// export const getNewBullet = (x=0, y=0, newCloneId=0, id='bullet') => new Ball({ 
//   id, 
//   cloneId: newCloneId, 
//   x, y, 
//   r: 10,
//   fillStyle: '#f010ad', 
//   movement: {
//     isMove: true,
//     vx: 10, 
//     vy: 0,
//   } 
// })
export const getNewBullet = (x=0, y=0, newCloneId=0, id='bullet') => new BasicStaticImgObj({ 
  id, 
  cloneId: newCloneId, 
  x, y, 
  width: 60, height: 20,
  imgSrc: bullet01,
  rotate: 20,
  movement: {
    isMove: true,
    vx: 10, 
    vy: 0,
  } 
})

// export const getNewDirectiveBullet = (obj, vx, vy, newCloneId=0, id='directive') => new Ball({ 
//   id, 
//   cloneId: newCloneId, 
//   x: obj.x + obj.width / 2, 
//   y: obj.y + obj.height / 2, 
//   r: 10,
//   fillStyle: id === 'missile' ? '#00a' : '#0a0', 
//   movement: {
//     isMove: true,
//     vx, 
//     vy,
//   } 
// })
export const getNewDirectiveBullet = (obj, vx, vy, newCloneId=0, id='directive', rotate) => new BasicStaticImgObj({ 
  id, 
  cloneId: newCloneId, 
  x: obj.x + obj.width / 2, 
  y: obj.y + obj.height / 2, 
  width: 70, height: 10,
  imgSrc: bullet02,
  rotate,
  movement: {
    isMove: true,
    vx, 
    vy,
  } 
})


export const getNewEnemyBullet = (x=0, y=0, newCloneId=0) => new Ball({ 
  id: 'bulletEnemy', 
  cloneId: newCloneId, 
  x, y, 
  r: 8,
  fillStyle: '#09a', 
  movement: {
    isMove: true,
    vx: -7, 
    vy: 0,
  } 
})
export const getNewObstacle = (x, y, cloneId, rotate=0, zoomRatio=1) => new BasicStaticImgObj({
  id: 'obstacle',
  type: 'obs',
  cloneId,
  x, y,
  imgSrc: building,
  width: 250,
  height: 430,
  rotate, zoomRatio,
  movement: {
    isMove: true,
    vx: -3, 
    vy: 0,
  } 
})
export const getNewBuffItem = (x, y, cloneId, rotate=0, zoomRatio=1) => new BasicStaticImgObj({
  id: 'buff',
  // type: 'directive',
  type: 'spread',
  cloneId,
  x, y,
  imgSrc: buff01,
  width: 40,
  height: 40,
  rotate, zoomRatio,
  movement: {
    isMove: true,
    vx: -10, 
    vy: 0,
  } 
})


//text components
export const numericText = (x, y, fillStyle, prop=0, value=0) => {
  const text = new BasicText({ x, y, text: '', fillStyle, })
  return (
    text
      .setProp(prop, value)
      .setProp('basicTxt', `${ prop }: `)
      .addUpdateRule((e) => {
        e.text = e.basicTxt + e[prop]
      })
      .addPropForUpdate(prop)
  )
}
export const scoreText = numericText(800, 20, '#1a0', 'score', 0)
export const healthText = numericText(100, 20, '#a00', 'health', 10)
export const levelText = numericText(900, 20, '#111', 'level', 1)
export const coinText = numericText(700, 20, '#fa0', 'coin', 0)

//

export const player = () => {
  const obj = new ControllableObj({
    // fillStyle: '#a0a',
    imgSrc: iconImg,
    x: 100, y: 300,
    width: 90, height: 100,
    hitbox: { w: 50, h: 50 },
    status: {
      default: iconImg,
      directive: iconImg03,
      spread: iconImg02,
    },
  })
  obj.attackFrequency = 600 //every 600ms can attack
  return obj
} 
export const myPlayer = player()
console.log(myPlayer)


console.log(scoreText)

