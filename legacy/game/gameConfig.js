import { 
  freeIcon,
  testBackArr
 } from './gameObj'

export const initGameConfig = [
  { layer: 'UILayer', id: 2001, objProp: 'text', value: 1 },

]
export const styleConfig = {
  fontStyle: {
    sSize: '12px Arial',
    mSize: '18px Arial'
  }
}
export const canvasSpec = {
  width: 360,
  height: 640,
}
export const canvasObjAreaSpec = {
  width: 360,
  height: 540,
}


export const TABconfig = [
  { 
    tabId: 'tabRect_A', 
    blurColor: 'rgba(20, 200, 20, 0.5)', 
    focusColor: 'rgba(20, 200, 20, 1)', 
    BGId: 'UIDisplay_A',  
  },
  { 
    tabId: 'tabRect_B', 
    blurColor: 'rgba(200, 20, 20, 0.5)', 
    focusColor: 'rgba(200, 20, 20, 1)', 
    BGId: 'UIDisplay_B',  
  },
  { 
    tabId: 'tabRect_C', 
    blurColor: 'rgba(20, 20, 200, 0.5)', 
    focusColor: 'rgba(20, 20, 200, 1)', 
    BGId: 'UIDisplay_C',  
  },
]
export const ShopIconConfig = [
  { posId: 0, id: 'ShopIcon_shop', imgSrc: freeIcon.shop },
  { posId: 1, id: 'ShopIcon_info', imgSrc: freeIcon.info },
  { posId: 2, id: 'ShopIcon_coins', imgSrc: freeIcon.coins },
  { posId: 3, id: 'ShopIcon_burger', imgSrc: freeIcon.burger },
  { posId: 4, id: 'ShopIcon_hotDog', imgSrc: freeIcon.hotDog },
  { posId: 5, id: 'ShopIcon_car', imgSrc: freeIcon.car },
  { posId: 6, id: 'ShopIcon_iceCream', imgSrc: freeIcon.iceCream },
  { posId: 7, id: 'ShopIcon_cheese', imgSrc: freeIcon.cheese },
]
export const ShopUIConfig = {
  backGround: { 
    width: 300, 
    height: 500, 
    imgSrc: testBackArr[3]
  },
  iconDist: {
    y: 80,
  }
}