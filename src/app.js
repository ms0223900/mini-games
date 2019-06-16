import React, { useCallback, useRef, useEffect } from 'react'
import { MyGame } from './shootingGame'
import { canvasSpec } from './config'

export default () => {
  const thisCanvas = useRef()
  const myGame = useRef()
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
    <div>
      <canvas 
        style={{ boxShadow: '0px 0px 10px #111'}}
        width={ canvasSpec.width } 
        height={ canvasSpec.height } 
        ref={ setCanvas } />
    </div>
  )
}