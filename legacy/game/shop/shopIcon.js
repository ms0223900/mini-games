import { 
  drawUIText,
} from '../gameLib'
import { Icon } from '../components/Icon'
// import { ShopUIConfig } from '../gameConfig'
import { getCanvasGroup } from '../gameFunc'


export class drawNumberCountTest extends drawUIText {
  constructor({ count , ...props}) {
    super(props)
    this.count = count
    this.text = 'X ' + this.count
    this.prev = {
      count: this.count,
    }
  }
  updateWithProps() {
    if(this.prev.count !== this.count) {
      this.text = 'X ' + this.count
    }
    this.prev.count = this.count
  }
  render(ctx) {
    // this.ctx.restore()
    if(!this.groupDisplay.includes(false)) {
      this.display = true
      this.draw(ctx)
    } else {
      this.display = false
    }
    this.updateWithProps()
  }
}
// export class PopUpText extends drawUIText {
//   super(props) {

//   }
// }

export const ShopCount = ({ id, count=0, }) => ({
  id: 'shopCount_' + id,
  cloneId: 0,
  OBJ: new drawNumberCountTest({
    x: 0, y: 60,
    textConfig: '14px Arial',
    count,
    containerWidth: 40,
  })
})

export const ShopIcon = ({ id='ShopIcon', x=0, y=0, iconImgSrc='', iconCount, }) => getCanvasGroup({
  id,
  spec: [x, y],
  groupObjs: [
    Icon({ imgSrc: iconImgSrc }),
    ShopCount({ id, count: iconCount })
  ]
})