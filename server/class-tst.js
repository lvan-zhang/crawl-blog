class Csdn {
  constructor (x, y) {
    this.x = x
    this.y = y
  }
  add = () => {
    return this.x + this.y
  }
  sleep = time => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('ok')
      }, time)
    })
  }
  start = async () => {
    let result = await this.sleep(1000)
    let sum = this.add()
    console.log(sum)
    return result
  }
}
let csdn = new Csdn(2, 3)
let b = csdn.start().then(res => {
  console.log(res)
})
// console.log(b)