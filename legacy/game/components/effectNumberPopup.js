import { 
  drawUIText,
} from '../gameLib'

class effectNumberPopUp extends drawUIText {
  constructor(props) {
    super(props)
    this.opacity = 1
    this.opacityRate = 0.04
    this.pop = {
      limit: 30,
      now: 0,
      originY: this.y,
    }
  }
  popUp() {
    if(this.pop.now < this.pop.limit) {
      this.pop.now ++
      if(this.opacity - this.opacityRate > 0) {
        this.opacity = this.opacity - this.opacityRate
      } else {
        this.opacity = 0
      }
      this.y -= 0.35
    }
  }
  render(ctx) {
    ctx.save()
    ctx.globalAlpha = this.opacity
    this.popUp()
    this.draw(ctx)
    ctx.restore()
  }
}

export default ({ x=100, y=100, id='', count=1, operation='+', }) => ({
  id: 'effectNumberPopUp_' + id, cloneId: 0,
  OBJ: new effectNumberPopUp({
    x, y,
    textConfig: '18px Arial',
    text: operation + ' ' + count,
    containerWidth: 40,
  })
})