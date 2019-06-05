import { MyItemsContainer } from './itemsContainer'
import mainUIContainer from '../mainGameUI/mainUIContainer'
import { ShopIconConfig } from '../gameConfig'
import { getLayerObjByIdCloneId } from '../gameFunc'

const SHOPICON = ShopIconConfig.slice(0, 4).map(con => con = con.id)

export const ItemsActions = (gameInstanse) => {
  const { UILayer } = gameInstanse.myLayers
  //  = gameInstanse.getAttr('UILayer', 'ItemsContainer')
  return ([
    {
      layer: UILayer, 
      id: 'ItemOpenIcon', cloneId: 0, 
      fn: () => {
        const  ItemsContainerGroupDisplay = gameInstanse.getAttr('UILayer', 'ItemsContainer', 0,'display')
        gameInstanse.setAttr('UILayer', 'ItemsContainer', 0, 'display', !ItemsContainerGroupDisplay)
        console.log(getLayerObjByIdCloneId(MyItemsContainer.OBJ.groupObjs, 'shopCount_ShopIcon_shop', 0))
      },
    },

    ...SHOPICON.map(icon => consumeItems(gameInstanse, icon)),

    
  ])
}

export const updateHealthBar = () => mainUIContainer.updateCount('healthBar', 'barState', 'length', 10)


const consumeItems = (gameInstanse, id) => ({
  layer: gameInstanse.myLayers.UILayer, 
  id: id, cloneId: 1, 
  fn: () => {
    const originCount = MyItemsContainer
      .getContainerAttr(
        MyItemsContainer.containerStates.items, 'shopCount_' + id).count
    if(originCount - 1 > 0) {
      MyItemsContainer.updateCount('shopCount_' + id, 'items', 'count', -1)
    } else {
      MyItemsContainer.removeObjInContainer(id, 1)
    }
    updateHealthBar()
  },
})
