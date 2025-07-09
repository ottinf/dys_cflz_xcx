class Test {

  ///////////////////////////////////////////////////////////////////
  // 基础方法
  ///////////////////////////////////////////////////////////////////

  constructor() {
    // 构造函数，如果需要初始化一些东西可以在这里做
    this.init()
  }

  init() {
    this.counter = 0
  }

  getCounter() {
    this.counter = (this.counter + 1) % 99999999
  }

}

// 导出类的一个新实例
export default new Test();