import { 
  Icon, 
} from '../components/Icon'
import { ShopIcon } from './shopIcon'
import { ShopBG_B } from './shopBG'
import { freeIcon } from '../gameObj'
import { 
  // canvasSpec,
  ShopIconConfig,
  ShopUIConfig 
} from '../gameConfig'
import { 
  getCanvasGroup, 
  mergeArrObjs,
} from '../gameFunc'
import { Container } from '../gameLib'
import { handleBlockLineBreak } from '../../functions'
import ShopTabs from './shopTabs'
import EffectNumberPopup from '../components/effectNumberPopup'
import { DefaultTimer } from '../components/countDownTimer'
import { WanderCat } from '../components/chracter'


const { width: backW, height: backH, imgSrc: backImgSrc } = ShopUIConfig.backGround


export const shopItems = (itemsId=1) => {
  const groupYDis = 100
  const itemsStartPos = 4 * (itemsId - 1)
  const shopIcons = ShopIconConfig.slice(itemsStartPos, 4 * itemsId)
  const xy = shopIcons
    .map(config => handleBlockLineBreak(config.posId - itemsStartPos, 3, 80, backW, 40))
  let iconConfig = []
  for (let i = 0; i < xy.length; i++) {
    iconConfig[i] = {
      ...shopIcons[i],
      x: xy[i].x,
      y: xy[i].y,
    }
  }

  return getCanvasGroup({
    id: 'shopItems' + itemsId,
    spec: [0, groupYDis],
    groupObjs: [
      ...iconConfig.map(iconConfig => ShopIcon({
        id: iconConfig.id,
        x: iconConfig.x,
        y: iconConfig.y,
        iconImgSrc: iconConfig.imgSrc,
        iconCount: 0,
      })),
    ]
  })
}
export const shopItems1 = shopItems(1)
export const shopItems2 = shopItems(2)


export const CloseIcon = Icon({
  id: 'closeIcon',
  imgSrc: freeIcon.close,
  x: 280, y: -20,
})
export const ShopBG = ShopBG_B({
  imgSrc: backImgSrc,
  x: 0, y: 0,
  w: backW, h: backH,
})

const IconInTimer = () => Icon({
  id: 'IconInTimer',
  imgSrc: freeIcon.power,
  x: 0, y: 30,
})
export const ObjTimer = ({ x, y }) => DefaultTimer({
  x, y,
  countDownTime: 10,
  objsInTimer: [
    IconInTimer(),
  ],
  popUpObjs: [
    EffectNumberPopup({ x, y, id: 'timerPop', count: 10, }),
  ]
})

export const shopContainerGroup = (x, y) => {
  return getCanvasGroup({
    id: 'ShopContainer', 
    spec: [x, y], 
    groupObjs: [
      ShopBG,
      shopItems1,
      shopItems2,
      ShopTabs(),
      CloseIcon,
      WanderCat(),
      // ObjTimer,
    ]
  })
}


const subscribeIds = [
  { id: 'shopCount_ShopIcon_shop', attr: 'count', },
  { id: 'shopCount_ShopIcon_info', attr: 'count', },
  { id: 'shopCount_ShopIcon_coins', attr: 'count', },
  { id: 'shopCount_ShopIcon_burger', attr: 'count', },
]
export class ShopContainer extends Container {
  constructor(props) {
    super(props)
  }
  updateComponents() {
    const { countNum } = this.containerStates
    const countNumObj = countNum.map(num => num = { num })
    const mergeStates = mergeArrObjs(subscribeIds, countNumObj)
    console.log(mergeStates)
    mergeStates.map(st => this.setAttr(st.id, 0, st.attr, st.num))
  }
}
// MyShopContainer.subscribeAttrToUpdate({ 
//   id: 'shopCount_ShopIcon_shop', attr: 'count',
//   containerStates: MyShopContainer.containerStates.countNum[0]
// })

export const MyShopContainer = new ShopContainer({
  containerStates: { countNum: [40, 30, 40, 99] },
  containerGroup: shopContainerGroup(22, 99),
})
//init container
MyShopContainer.updateComponents()
MyShopContainer.setAttr('tabA', 0, 'opacity', 1)
MyShopContainer.setAttr('shopItems2', 0, 'display', false)
console.log(MyShopContainer)