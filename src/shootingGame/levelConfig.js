export const levelConfig = [
  {
    level: 1,
    enemyAmount: 10,
    enemyPercent: [0.7, 0.2, 0.1]
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

export const reduceArrPrevAll = (arr, i) => (
  arr.slice(0, i + 1).reduce((a=0, b) => a + b, 0)
)

export const getProbability = (percentArr) => {
  const rand = Math.round(Math.random() * 100) / 100
  for (let i = 0; i < percentArr.length; i++) {
    if(rand >= reduceArrPrevAll(percentArr, i - 1) && rand < reduceArrPrevAll(percentArr, i)) {
      return i
    }
      
  }
}