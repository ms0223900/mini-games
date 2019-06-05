import { 
  drawRect,
  drawUIText,
  drawStaticImg,
} from './gameLib'
import { 
  getCanvasGroup,
  getCanvasComponent,
} from './gameFunc'
import { 
  testBackArr,
  testMapIcon,
 } from './gameObj'

export const tabRect = (color, txt) => ({
  id: 'tabRect_' + txt,
  cloneId: 0,
  OBJ: new drawRect({
    x: 0, y: 0,
    w: 60, h: 30,
    fillStyle: color
  })
}) 
export const tabText = (txt) => ({
  id: 'tabText' + txt,
  cloneId: 0,
  OBJ: new drawUIText({
    x: 0, y: 10,
    textConfig: '18px Arial',
    text: txt, fillStyle: '#fff',
    containerWidth: 60,
    textAlignCenter: true,
  })
})



export const UITabs = (txt, x, y, fillColor) => getCanvasGroup({
  id: 'UITabs_' + txt,
  spec: [x, y],
  groupObjs: [
    tabRect(fillColor, txt),
    tabText(txt)
  ]
})

export const UIDisplay = (txt, x, y, imgSrc, backImgSrc) => getCanvasGroup({
  id: 'UIDisplay_' + txt,
  spec: [x, y],
  groupObjs: [
    getCanvasComponent('UIDisplayBG_' + txt, backImgSrc, [200, 200, 0, 0], drawStaticImg, 0.8),
    getCanvasComponent('UIDisplayComponent_' + txt, imgSrc, [60, 60, 0, 0], drawStaticImg, 0.8),
  ]
})
export const UITabs_A = UITabs('A', 30, 100, 'rgba(20, 200, 20, ' + '1)')
export const UITabs_B = UITabs('B', 120, 100, 'rgba(200, 20, 20, ' + '0.5)')
export const UITabs_C = UITabs('C', 200, 100, 'rgba(20, 20, 200, ' + '0.5)')

export const UIDisplay_A = UIDisplay('A', 30, 140, testMapIcon[2], testBackArr[0])
export const UIDisplay_B = UIDisplay('B', 30, 140, testMapIcon[3], testBackArr[1])
export const UIDisplay_C = UIDisplay('C', 30, 140, testMapIcon[4], testBackArr[2])