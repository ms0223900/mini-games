import { 
  myGame,  
} from './gameLib'
import { 
  ShopOpenIcon,
  ItemOpenIcon,
} from './mainGameUI/mainUIGameIcons'
import mainUIContainer from './mainGameUI/mainUIContainer'
import { MyShopContainer } from './shop/shopContainer'
import { MyItemsContainer } from './items/itemsContainer'
import { 
  backTest 
} from './gameComponents'

//layers

export class myLayer {
  constructor(layerObjs=[]) {
    this.layerObjs = layerObjs
  }
  render(ctx) {
    // console.log(this.layerObjs)
    for (let i = 0; i < this.layerObjs.length; i++) {
      this.layerObjs[i].OBJ.render(ctx)
    }
  }
}


export const UILayer = new myLayer([
  // testGroupMap(100, 100),
  mainUIContainer,
  MyItemsContainer,
  ItemOpenIcon,
  ShopOpenIcon,
  MyShopContainer,
])
export const ObjLayer = new myLayer([ 
  // userCharacter(120, 120) 
])
export const BackLayer = new myLayer([ 
  backTest 
])
  


//init game
const allLayer = {
  BackLayer: BackLayer,
  ObjLayer: ObjLayer,
  UILayer: UILayer,
}
export const idleGame = (ctx) => (
  new myGame(ctx, allLayer)
)