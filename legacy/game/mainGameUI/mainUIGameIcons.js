import { canvasSpec } from '../gameConfig'
import { freeIcon } from '../gameObj'
import { Icon } from '../components/Icon'

export const ShopOpenIcon = Icon({
  imgSrc: freeIcon.shop,
  id: 'ShopOpenIcon',
  x: canvasSpec.width - 60,
  y: canvasSpec.height - 80,
})
export const ItemOpenIcon = Icon({
  imgSrc: freeIcon.item,
  id: 'ItemOpenIcon',
  x: 20,
  y: canvasSpec.height - 80,
})

export const HealthIcon = Icon({
  imgSrc: freeIcon.heart,
  id: 'HealthIcon',
  x: 0, y: 0,
})
export const PowerIcon = Icon({
  imgSrc: freeIcon.power,
  id: 'PowerIcon',
  x: 0, y: 0,
})
export const SmartIcon = Icon({
  imgSrc: freeIcon.book,
  id: 'SmartIcon',
  x: 0, y: 0,
})