/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useCallback, useRef, useEffect } from 'react'
import { Game } from './game/gameLib'
// import { idleGame,  } from './game/Layers'

export default () => {
  const thisCanvas = useRef()
  const myGame = useRef()
  //
  const setCanvas = useCallback((el) => {
    thisCanvas.current = el
    console.log(thisCanvas.current)
  })
  useEffect(() => {
    myGame.current = new Game(thisCanvas.current)
    myGame.current.render()
  }, [])
  //
  return (
    <div>
      <canvas ref={ setCanvas } />
    </div>
  )
}