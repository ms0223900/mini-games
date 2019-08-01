import { BasicStaticImgObj } from '../game/gameLib'

export class Camera extends BasicStaticImgObj {
  constructor({ maxWidth, maxHeight, ...props }) {
    super(props)
    this.w = maxWidth
    this.width = maxWidth
    this.height = maxHeight
    this.h = maxHeight
    this.originCenterX = maxWidth / 2,
    this.originCenterY = maxHeight / 2,
    this.x = maxWidth / 2,
    this.y = maxHeight / 2,
    this.vx = 0,
    this.vy = 0,
    this.offsetX = 0,
    this.offsetY = 0
    this.shakeProps = {
      ...this.shakeProps,
      shakeDist: 1.5,
      shakeFreq: 2,
    }
  }
  updatePos(x, y) {
    if(x >= this.w / 2) {
      this.x = x
      this.offsetX = this.x - this.originCenterX 
    } else {
      this.offsetX = 0
    }
    if(y <= this.h / 2) {
      this.y = y
      this.offsetY = this.y - this.originCenterY
    } else {
      this.offsetY = 0
    }
  }
  move() {
    this.x += this.vx
    this.offsetX = this.x - this.originCenterX
    this.y += this.vy
    this.offsetY = this.y - this.originCenterY
  }
  detectIsOutofBound(obj) {
    if(obj.x < this.x - this.w / 2 || obj.x > this.x + this.w / 2 ||
      obj.y < this.y - this.h / 2 || obj.y > this.y + this.h / 2) {
        return true
      } 
    return false
  }
}

// export function Camera(maxWidth, maxHeight) {
//   return ({
//     w: maxWidth,
//     width: maxWidth,
//     height: maxHeight,
//     h: maxHeight,
//     originCenterX: maxWidth / 2,
//     originCenterY: maxHeight / 2,
//     x: maxWidth / 2,
//     y: maxHeight / 2,
//     vx: 0,
//     vy: 0,
//     offsetX: 0,
//     offsetY: 0,
//     shakeProps: {
//       shakeDist: 2,
//       shakeFreq: 5,
//       shakeTimes: 0,
//       shakeI: 0,
//       shakeDirNow: 'right'
//     },
//     hitbox: {
//       w: this.width,
//       h: this.height,
//     },
//     hitboxOffset: {
//       x: (this.width - this.hitbox.w) / 2,
//       y: (this.height - this.hitbox.h) / 2,
//     },
//     hitboxSpec: {
//       x: this.x,
//       y: this.y,
//       ...this.hitbox
//     },
//     spec: {
//       x: this.x + this.hitboxOffset.x,
//       y: this.y + this.hitboxOffset.y,
//       w: this.hitbox.w,
//       h: this.hitbox.h
//     },
//     setProp(prop, value) {
//       this[prop] = value
//       if(prop === 'x' || prop === 'y' || prop === 'width' || prop === 'height') {
//         const { x, y, w, h } = this.spec
//         if(prop === 'height') {
//           this.updateSpec(x, y, w, value)
//         }
//         if(prop === 'width') {
//           this.updateSpec(x, y, value, h)
//         }
//         if(prop === 'x') {
//           this.updateSpec(value, y, w, h)
//         }
//         if(prop === 'y') {
//           this.updateSpec(x, value, w, h)
//         }
//         //
//       }
//       return this
//     },
//     updatePos(x, y) {
//       if(x >= this.w / 2) {
//         this.x = x
//         this.offsetX = this.x - this.originCenterX 
//       } else {
//         this.offsetX = 0
//       }
//       if(y <= this.h / 2) {
//         this.y = y
//         this.offsetY = this.y - this.originCenterY
//       } else {
//         this.offsetY = 0
//       }
//     },
//     move() {
//       this.x += this.vx
//       this.offsetX = this.x - this.originCenterX
//       this.y += this.vy
//       this.offsetY = this.y - this.originCenterY
//     },
//     detectIsOutofBound(obj) {
//       if(obj.x < this.x - this.w / 2 || obj.x > this.x + this.w / 2 ||
//         obj.y < this.y - this.h / 2 || obj.y > this.y + this.h / 2) {
//           return true
//         } 
//       return false
//     }
//   })
// }
