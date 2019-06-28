import React, { useCallback, useRef, useEffect, useState } from 'react'
import { MyGame } from './shootingGame'
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
      <canvas 
        onClick={ 
          () => { 
            shootBullet(myGame.current) } }
        style={{ boxShadow: '0px 0px 10px #111'}}
        width={ canvasSpec.width } 
        height={ canvasSpec.height } 
        ref={ setCanvas } />
    </div>
  )
}