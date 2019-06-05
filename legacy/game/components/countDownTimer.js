import { 
  drawUIText,
  drawRect,
  myGroupObjs,
} from '../gameLib'
import { updateHealthBar } from '../items/itemsActions'

class TimeText extends drawUIText {
  constructor(props) {
    super(props)
    this.prevTime = 0
    this.countDownTime = 0
    this.time = 0
    this.text = ''
  }
  convertTime() {
    const sec = this.time % 60 < 10 ? '0' + this.time % 60 : this.time % 60 
    const min = ~~(this.time / 60)
    this.text = min + ' : ' + sec
  }
  render(ctx) {
    this.convertTime()
    this.draw(ctx)
  }
}
class TimeRect extends drawRect {
  constructor({ timeRectType='BG', countDownTime=100, ...props }) {
    super(props)
    this.prevTime = 0
    this.time = 0
    this.maxWidth = 200
    this.countDownTime = countDownTime
    this.w = this.maxWidth
    this.timeRectType = timeRectType
  }
  setWidthByTimeAndType() {
    if(this.timeRectType === 'Active') {
      this.w = (this.time / this.countDownTime) * this.maxWidth
    }
  }
  render(ctx) {
    ctx.save()
    this.setWidthByTimeAndType()
    this.draw(ctx) 
    ctx.restore()
  }
}
//
const countDownTxt = () => ({
  id: 'countDownTxt', cloneId: 0,
  OBJ: new TimeText({
    x: 0, y: 40,
    containerWidth: 200,
  }),
})
const timerRectBG = (countDownTime) => ({
  id: 'timerRectBack', cloneId: 0,
  OBJ: new TimeRect({
    x: 0, y: 0,
    h: 10,
    fillStyle: '#ddd',
    timeRectType: 'BG',
    countDownTime,
  })
})
const timerRectActive = (countDownTime) => ({
  id: 'timerRectBack', cloneId: 0,
  OBJ: new TimeRect({
    x: 0, y: 0,
    h: 10,
    fillStyle: '#333',
    timeRectType: 'Active',
    countDownTime,
  })
})
//
export default class Timer extends myGroupObjs {
  constructor({ countDownTime=100, popUpObjs=[], updateFns=[],  ...props }) {
    super(props)
    this.time = countDownTime
    this.updateFns = updateFns
    this.timer = setInterval(() => {
      const newTime = this.time - 1
      this.handleChangeByTime(newTime)
      // 2sec to update numbers
      if(this.time % 2 === 0) { 
        this.resetPopUpObjs() 
        this.updateFns.map(fn => fn())
      }
      this.time = newTime
    }, 1000)
    this.popUpObjs = popUpObjs
    this.groupObjs = [
      ...this.groupObjs,
      ...popUpObjs,
    ]
    this.handleChangeByTime(countDownTime)
    this.groupObjs.map(go => go.OBJ.countDownTime = countDownTime)
  }
  resetPopUpObjs() {
    for (let i = 0; i < this.popUpObjs.length; i++) {
      const OBJ = this.popUpObjs[i].OBJ
      const originY = OBJ.pop.originY
      OBJ.setAttr('opacity', 1)
      OBJ.setAttr('y', originY)
      OBJ.pop.now = 0
    }
  }
  checkTimer() {
    if(this.time <= 0) {
      this.display = false
      clearInterval(this.timer)
    }
  }
  handleChangeByTime(time) {
    this.groupObjs.map(go => go.OBJ.time = time)
  }
  render(ctx) {
    ctx.save()
    this.checkTimer()
    this.draw(ctx) 
    ctx.restore()
  }
}
export const DefaultTimer = ({ x=100, y=200, countDownTime=100, objsInTimer=[], popUpObjs }) => ({
  id: 'DefaultTimer', cloneId: 0,
  OBJ: new Timer({
    x, y,
    countDownTime,
    groupObjs: [
      countDownTxt(),
      timerRectBG(countDownTime),
      timerRectActive(countDownTime),
      ...objsInTimer,
    ],
    popUpObjs,
    updateFns: [
      updateHealthBar,
    ]
  }),
})