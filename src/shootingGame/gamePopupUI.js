import { uiImages } from './levelConfig'
//
let UI, gameOver
window.onload = () => {
  UI = document.getElementById('UI')
  gameOver = document.getElementById('gameOver')
  // setUI()
  console.log(UI)
  console.log(gameOver)
}
//set shop UI
export const setUIcoinNow = (coinNow) => {
  document.getElementById('coinNow').innerText = coinNow
}
export const setShopUI = (buyItemFn, itemPrices, setGameContinueFn, coinNow) => {
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
  const continueBTN = document.getElementById('continueBTN')
  continueBTN.addEventListener('click', () => {
    setGameContinueFn()
    UI.style.display = 'none'
    const clonedBTN = continueBTN.cloneNode(true)
    continueBTN.parentNode.replaceChild(clonedBTN, continueBTN)
  })
}
//
export const setGameOverUI = (gameInstance, restartFn, resultScore=1000) => {
  document.getElementById('gameOver').style.display = 'block'
  document.getElementById('result').innerText = resultScore
  const restartBTN = document.getElementById('restartBTN')
  restartBTN.addEventListener('click', () => {
    gameInstance[restartFn]()
    const clonedBTN = restartBTN.cloneNode(true)
    restartBTN.parentNode.replaceChild(clonedBTN, restartBTN)
    document.getElementById('gameOver').style.display = 'none'
  })
  //
}
