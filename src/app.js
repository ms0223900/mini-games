import React, { useCallback, useRef, useEffect } from 'react'
import { MyGame } from './game/gameLib'
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
        width={ canvasSpec.width } 
        height={ canvasSpec.height } 
        ref={ setCanvas } />
    </div>
  )
}