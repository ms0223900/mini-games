import { 
  drawStaticImg,
} from '../gameLib'

export const Icon = ({ imgSrc='', id='Icon', x=0, y=0, opacity=1 }) => ({
  id,
  cloneId: 0,
  OBJ: new drawStaticImg({
    imgSrc: imgSrc,
    x, y,
    width: 40,
    height: 40,
    opacity,
  })
})

