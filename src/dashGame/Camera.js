export function Camera(maxWidth, maxHeight) {
  return ({
    w: maxWidth,
    h: maxHeight,
    originCenterX: maxWidth / 2,
    originCenterY: maxHeight / 2,
    x: maxWidth / 2,
    y: maxHeight / 2,
    vx: 0,
    vy: 0,
    offsetX: 0,
    offsetY: 0,
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
    },
    move() {
      this.x += this.vx
      this.offsetX = this.x - this.originCenterX
      this.y += this.vy
      this.offsetY = this.y - this.originCenterY
    },
    detectIsOutofBound(obj) {
      if(obj.x < this.x - this.w / 2 || obj.x > this.x + this.w / 2 ||
        obj.y < this.y - this.h / 2 || obj.y > this.y + this.h / 2) {
          return true
        } 
      return false
    }
  })
}