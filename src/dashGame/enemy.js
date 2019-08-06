export const enemyShakeAndKnockback = (enemy, camera, direction) => {
  const { vx } = enemy.movement
  enemy.setProp('fillStyle', '#ad0')
  enemy.setProp('isAttacked', true)
  enemy.setProp('prevProps', {
    vx,
  })
  enemy.setProp('MPSpec', {
    ...enemy.MPSpec,
    isPause: true,
  })
  enemy.setProp('movement', {
    ...enemy.movement,
    // isMove: false,
    vx: direction === 'right' ? 8 : -8
  })
  camera.setProp('shakeProps', {
    ...camera.shakeProps,
    shakeStart: true
  })
  //
  setTimeout(() => {
    enemy.setProp('fillStyle', '#a0f')
    // enemy.setProp('isAttacked', false)
    enemy.setProp('MPSpec', {
      ...enemy.MPSpec,
      isPause: false,
    })
    enemy.setProp('movement', {
      ...enemy.movement,
      // isMove: true,
      vx: enemy.prevProps.vx,
    })
  }, 200)
  setTimeout(() => enemy.setProp('isAttacked', false), 500)
}