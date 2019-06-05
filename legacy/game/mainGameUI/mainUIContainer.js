import { getCanvasGroup } from '../gameFunc'
import { Container } from '../gameLib'
import { HealthBar, PowerBar, SmartBar } from './statusBar'

const containerStates = {
  barState: [
    { id: 'healthBar', length: 100, },
    { id: 'powerBar', length: 100, },
    { id: 'smartBar', length: 100, },
  ]
}
export const barRect = ['healthBar_barRect', 'powerBar_barRect', 'smartBar_barRect']


const mainContainerGroup = (x, y) => getCanvasGroup({
  id: 'MainContainer',
  spec: [x, y],
  groupObjs: [
    HealthBar, 
    PowerBar, 
    SmartBar
  ]
})

class MainContainer extends Container {
  constructor(props) {
    super(props)
  }
  updateComponents() {
    // const { health, power, smartPower } = this.containerState
    const { barState } = this.containerStates
    barState.map(bar => this.setAttr(bar.id + '_barRect', 0, 'length', bar.length))
    barState.map(bar => this.setAttr(bar.id + '_statusCount', 0, 'count', bar.length))
  }
}

export default new MainContainer({
  containerStates,
  containerGroup: mainContainerGroup(20, 20),
})
