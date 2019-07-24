import React, { useCallback, useRef, useEffect, useState } from 'react'
// import { MyGame } from './shootingGame'
// import { myPlayer } from './shootingGame/components'
import DashGame from './dashGame'
import { canvasSpec } from './config'
import { shootBullet } from './shootingGame/player'
import './styles/style.scss'

function setKeysMove(game) {
  window.addEventListener('load', () => {
    const addGameEvent = (game, keyCode) => {
      return () => { game.newGameEvent({ keyCode, }) }
    }
    const addGameKeyUpEvent = (game, keyCode) => {
      return () => { game.newGameKeyUpEvent({ keyCode, }) }
    }
    const upBTN = document.getElementById('dPadUp')
    const downBTN = document.getElementById('dPadDown')
    const leftBTN = document.getElementById('dPadLeft')
    const rightBTN = document.getElementById('dPadRight')
    //
    const buttons = [
      { BTN: upBTN, keyCode: 38 },
      { BTN: downBTN, keyCode: 40 },
      { BTN: leftBTN, keyCode: 37 },
      { BTN: rightBTN, keyCode: 39 },
    ]
    buttons.forEach(btn => {
      btn.BTN.addEventListener('mousedown', addGameEvent(game, btn.keyCode))
      btn.BTN.addEventListener('touchstart', addGameEvent(game, btn.keyCode))
      btn.BTN.addEventListener('mouseup', addGameKeyUpEvent(game, btn.keyCode))
      btn.BTN.addEventListener('touchend', addGameKeyUpEvent(game, btn.keyCode))
    })
  })
}


export default () => {
  const thisCanvas = useRef()
  const myGame = useRef()
  const [uiDisplay, setDisplay] = useState('none')
  //
  const setCanvas = useCallback((el) => {
    thisCanvas.current = el
    console.log(thisCanvas.current)
  })
  useEffect(() => {
    
    // myGame.current = MyGame(thisCanvas.current, canvasSpec)
    myGame.current = DashGame(thisCanvas.current, canvasSpec)
    myGame.current.render()
    console.log(myGame.current)
    setKeysMove(myGame.current)
  }, [])
  //
  return (
    <div 
      // style={{ width: canvasSpec.width, height: canvasSpec.height, position: 'relative', }} 
      className={ 'root' }>
      <div id='UI' style={{ display: uiDisplay, }}>
        <button onClick={ () => setDisplay('none') }>Close</button>
        <h3 id={ 'coinNow' }></h3>
        <div className={ 'ui-container' }></div>
        <button id={ 'continueBTN' }>{ 'CONTINUE' }</button>
      </div>
      <div id={ 'gameOver' } style={{ display: uiDisplay }}>
        <h2>{ 'GameOver!' }</h2>
        <hr />
        <p>
          <span>{ 'Your result: ' }</span>
          <span id={ 'result' }>0000</span>
        </p>
        <button id={ 'restartBTN' }>{ 'Restart!' }</button>
      </div>
      <h3><span>{ 'keyCodes: ' }</span>
        <span id={ 'uiText' }></span>
        <span id={ 'uiText2' }></span>
        <span id={ 'uiText3' }></span></h3>
      <div 
        id={ 'canvasContainer' }>
        <canvas 
          onClick={ 
            () => { shootBullet(myGame.current) } }
          style={{ boxShadow: '0px 0px 10px #111'}}
          width={ canvasSpec.width } 
          height={ canvasSpec.height } 
          ref={ setCanvas } />
      </div>
      <div id={ 'controlPanel' }
        style={{ display: 'none' }}
      >
        <div id={ 'dPad' }>
          <button id={ 'dPadUp' }>UP</button>
          <button id={ 'dPadRight' }>RIGHT</button>
          <button id={ 'dPadDown' }>DOWN</button>
          <button id={ 'dPadLeft' }>LEFT</button>
        </div>
        <div id={ 'buttons' }>
          <button 
            onClick={ () => { shootBullet(myGame.current) } } id={ 'attackBTN' }>ATK</button>
        </div>
      </div>
    </div>
  )
}