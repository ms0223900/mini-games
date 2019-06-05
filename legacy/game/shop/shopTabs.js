import { Icon, } from '../components/Icon'
import { freeIcon } from '../gameObj'
import { getCanvasGroup, } from '../gameFunc'

export const tabA = () => {
  return Icon({
    id: 'tabA',
    x: 0, y: 0,
    imgSrc: freeIcon.pear,
    opacity: 0.4,
  })
}
export const tabB = () => {
  return Icon({
    id: 'tabB',
    x: 80, y: 0,
    imgSrc: freeIcon.hotDog,
    opacity: 0.4,
  })
}

export default () => {
  return getCanvasGroup({
    id: 'shopTabs',
    spec: [20, 20],
    groupObjs: [
      tabA(),
      tabB(),
    ]
  })
}