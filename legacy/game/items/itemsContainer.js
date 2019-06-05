import { getCanvasGroup } from '../gameFunc'
import { Container } from '../gameLib'
// import { mergeArrObjs } from '../gameFunc'
import itemsBG from './itemsBG'

export const ItemsContainerGroup = (x, y) => {
  return getCanvasGroup({
    id: 'ItemsContainer',
    spec: [x, y],
    groupObjs: [
      itemsBG,
    ]
  })
}

export class ItemsContainer extends Container {
  constructor(props) {
    super(props)
  }
  updateComponents() {
    const { items } = this.containerStates
    if(items.length > 0) {
      items.map(it => this.setAttr(it.id, 0, 'count', it.count))
    }
    
  }
}
export const MyItemsContainer = new ItemsContainer({
  containerStates: { items: [] },
  containerGroup: ItemsContainerGroup(30, 100),
})