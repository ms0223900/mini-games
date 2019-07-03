export const levelConfig = [
  {
    level: 1,
    enemyAmount: 10,
    enemyPercent: [0.7, 0.2, 0.8]
  },
  {
    level: 2,
    enemyAmount: 14,
    enemyPercent: [0.6, 0.3, 0.1]
  },
  {
    level: 3,
    enemyAmount: 20,
    enemyPercent: [0.5, 0.35, 0.15]
  },
  {
    level: 4,
    enemyAmount: 30,
    enemyPercent: [0.1, 0.1, 0.8]
  },
]
export const getInfiniteLevel = (level) => ({
  level: level + 1,
  enemyAmount: 10 + level * 5,
  enemyPercent: 0.7 - level * 0.1 <= 0.33 ? 
    [0.33, 0.33, 0.33] : 
    [0.7 - level * 0.1, 
    0.2 + level * 0.075, 
    0.1 + level * 0.025, ]
})


export const uiImages = [
  'https://cdn1.iconfinder.com/data/icons/ui-colored-2-of-3/100/UI_2__23-512.png',
  'https://image.shutterstock.com/image-vector/weapon-focus-plus-sign-denoting-600w-1151810723.jpg',
  'https://cdn4.iconfinder.com/data/icons/cyber-security-part-1/46/shield_add_security-512.png',
]
export const spawnEnemyFrequency = 100 //ms
export const bossHealth = 30