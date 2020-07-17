// 封装插件
// 1.导出export default
// 2.在main.js中导入requeat文件，并注册Vue.use

export default function(Vue){
//   vue是构造函数
// 在构造函数的原型对象上挂载函数，这样vue的实例化对象都可以使用这个函数

// 基础路径
  const baseUrl = 'https://api-ugo-web.itheima.net'
  Vue.prototype.request =async function(opts){
    // 解构
    const {url,data,method,header} = opts;

  // 请求之前有
  // 发请求之前加载loading
   uni.showLoading({
     title:"加载中..."
    })
    
   const [err,res] = await uni.request({
      url:baseUrl + url,
      data,
      method,
      header
    })

      // 加载之后关闭
      uni.hideLoading();

      return res.data.message
  }
}