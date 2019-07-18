import React, { useCallback, useRef, useEffect, useState } from 'react'
import { MyGame } from './shootingGame'
// import { myPlayer } from './shootingGame/components'
// import DashGame from './dashGame'
import { canvasSpec } from './config'
import { shootBullet } from './shootingGame/player'
import './styles/style.scss'

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
    
    myGame.current = MyGame(thisCanvas.current, canvasSpec)
    // myGame.current = DashGame(thisCanvas.current, canvasSpec)
    myGame.current.render()
    console.log(myGame.current)
  }, [])
  //
  return (
    <div style={{ width: canvasSpec.width, height: canvasSpec.height, position: 'relative', }}>
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
      <h3><span>{ 'ui: ' }</span><span id={ 'uiText' }></span></h3>
      <canvas 
        onClick={ 
          () => { shootBullet(myGame.current) } }
        style={{ boxShadow: '0px 0px 10px #111'}}
        width={ canvasSpec.width } 
        height={ canvasSpec.height } 
        ref={ setCanvas } />
      <div id={ 'controlPanel' }>
        <div id={ 'dPad' }>
          <button onMouseDown={ 
          () => { myGame.current.newGameEvent({ keyCode: 38 }) } }
          onMouseUp={ 
            () => { myGame.current.newGameKeyUpEvent({ keyCode: 38 }) } } id={ 'dPadUp' }>UP</button>
          <button onMouseDown={ 
          () => { myGame.current.newGameEvent({ keyCode: 39 }) } }
          onMouseUp={ 
            () => { myGame.current.newGameKeyUpEvent({ keyCode: 39 }) } } id={ 'dPadRight' }>RIGHT</button>
          <button onMouseDown={ 
          () => { myGame.current.newGameEvent({ keyCode: 40 }) } }
          onMouseUp={ 
            () => { myGame.current.newGameKeyUpEvent({ keyCode: 40 }) } } id={ 'dPadDown' }>DOWN</button>
          <button onMouseDown={ 
          () => { myGame.current.newGameEvent({ keyCode: 37 }) } }
          onMouseUp={ 
            () => { myGame.current.newGameKeyUpEvent({ keyCode: 37 }) } } id={ 'dPadLeft' }>LEFT</button>
        </div>
        <div id={ 'buttons' }>
          <button 
            onClick={ () => { shootBullet(myGame.current) } } id={ 'attackBTN' }>ATK</button>
        </div>
      </div>
    </div>
  )
}