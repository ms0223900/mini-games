import { 
  shopUIActions,
} from './shop/shopActions'
import { 
  ItemsActions,  } from './items/itemsActions'

import mainUIActions from './mainGameUI/mainUI_actions'

export const alertUIActions = (gameInstance) => {
  const { UILayer } = gameInstance.myLayers

  return ([
    { layer: UILayer, id: 'UIDisplayComponent_A', cloneId: 0, fn: () => {
      this.purchaseCoinUprade(10000)
    } },
  
    { layer: UILayer, id: 'cancelIcon', cloneId: 0, fn: () => {
      gameInstance.removeObjFromLayer('UILayer', 'alertUI', 1)
    } },
  
    { layer: UILayer, id: 'alertBack', cloneId: 0, fn: () => {
      return false
    } },
  ])
}


export const tapActionHolder = (gameInstance) => {
  //順序很重要, 越前面的層級越大
  return [
    ...alertUIActions(gameInstance),
    // ...tabActions(gameInstance),
    ...shopUIActions(gameInstance),
    ...ItemsActions(gameInstance),
    ...mainUIActions(gameInstance)
  ]
}