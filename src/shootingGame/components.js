/* eslint-disable no-unused-vars */
import {  
  BasicObj,
  Enemy,
  Ball,
  BasicText,
  BasicStaticImgObj,
  ControllableObj,
} from '../game/gameLib'
import { getProbability } from './levelConfig'
import iconImg from '../images/iconImg.png'
import monster01 from '../images/monster01.png'
import monster02 from '../images/monster02.png'
import monster03 from '../images/monster03.png'
import building from '../images/building.png'

//custom components
export const myBall = new Ball({ x: 440, y: 40, fillStyle: '#a00' })
myBall.setProp('movement', {
  ...myBall.movement,
  isMove: false,
  vx: -10,
  vy: 10,
})

//
const newEnemy = ( id='enemy', imgSrc, movement) => (x=300, y=300, cloneId=0, timerAttackFn) => 
new Enemy({ x, y, id, cloneId, width: 80, height: 80, imgSrc, useWall: false, movement, timerAttackFn })
//
export const boss = (id='boss', imgSrc=monster03, movement) => (x=700, y=300, cloneId=0, timerAttackFn) => 
new Enemy({ x, y, id, cloneId, width: 400, height: 400, imgSrc, useWall: false, movement, timerAttackFn, health: 20, }) 

export const enemy01 = newEnemy('enemy01', monster01, { isMove: true, vx: -3, vy: 0, })
export const enemy02 = newEnemy('enemy02', monster02, { isMove: true, vx: -5, vy: 0, })
export const enemy03 = newEnemy('enemy03', monster03, { isMove: true, vx: -7, vy: 0, })

export const spawnRandomEnemies = (x, y, cloneId, timerAttackFn, enemyPercent=[0.33, 0.33, 0.33]) => {
  const enemies = [enemy01, enemy02, enemy03]
  //enemy spawn probability
  const num = getProbability(enemyPercent) || 0
  return enemies[num](x, y, cloneId, timerAttackFn)
}

//
export const getNewBullet = (x=0, y=0, newCloneId=0) => new Ball({ 
  id: 'bullet', 
  cloneId: newCloneId, 
  x, y, 
  r: 10,
  fillStyle: '#f010ad', 
  movement: {
    isMove: true,
    vx: 10, 
    vy: 0,
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

//

export const myPlayer = new ControllableObj({
  // fillStyle: '#a0a',
  imgSrc: iconImg,
  x: 100, y: 100,
  width: 100, height: 100,
  hitbox: { w: 50, h: 50 }
})



console.log(scoreText)

