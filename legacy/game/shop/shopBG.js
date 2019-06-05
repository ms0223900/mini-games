import { getCanvasComponent } from '../gameFunc'
import { drawStaticImg } from '../gameLib'

export const ShopBG_A = ({ imgSrc, x, y, w, h }) => getCanvasComponent('ShopBG_A', imgSrc,[x, y, w, h])
export const ShopBG_B = ({ imgSrc, x, y, w, h }) => ({
  id: 'ShopBG_B',
  cloneId: 0,
  OBJ: new drawStaticImg({
    x, y,
    width: w, height: h,
    imgSrc
  })
})