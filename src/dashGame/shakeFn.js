function shake() { //horizontal shake
  console.log('this', this)
  const { shakeDist, shakeFreq, shakeDirNow, shakeI, shakeTimes } = this.shakeProps
  //
  if(shakeTimes % 2 === 0) {
    shakeTimes === 0 ? 
      this.setProp('x', this.x + shakeDist / 2) : this.setProp('x', this.x + shakeDist)
  } else {
    this.setProp('x', this.x - shakeDist)
  }
  shakeDirNow === 'right' ? this.setProp('shakeProps', {
    ...this.shakeProps,
    shakeDirNow: 'left',
  }) : 
  this.setProp('shakeProps', {
    ...this.shakeProps,
    shakeDirNow: 'right',
  })
  //
  this.setProp('shakeProps', {
    ...this.shakeProps,
    shakeI: shakeI + 1,
    shakeTimes: 
      (shakeI !== 0 && shakeI % shakeFreq === 0) ? shakeTimes + 1 : shakeTimes,
  })
}

export default shake