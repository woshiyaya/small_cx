<template>
  <view>
    <button type="primary" open-type="getUserInfo" @getuserinfo="btnGetInfo">微信登录</button>
  </view>
</template>

<script>
  export default {
    methods:{

      // js获取
      async JsGetInfo(){
        const [err,res] = await uni.getUserInfo();//输出res为null，那么就是没有通过用户的同意
        // console.log(res)
        if(!res){
          return;
        }
        this.getToken(res)
      },

      // 用户自己点击获取
      btnGetInfo(e){
        // console.log(e)
        this.getToken(e.detail)//获取到的是用户detail的数据
      },
    async getToken(data){
      // 登录的api
      const [err,codeObj] =  await uni.login();
      // 发送请求
      const message = await this.request({
          url:"/api/public/v1/users/wxlogin",
          method:"POST",
          data:{
            code:codeObj.code,
            encryptedData:data.encryptedData,
            iv:data.iv,
            rawData:data.rawData,
            signature:data.signature,
          }
        });
      // console.log(message)
      // 将token存入到本地
      uni.setStorageSync("token",message.token);
      // 点击完登录后直接返回到上一级
      uni.navigateBack();
      }
    },
    onLoad(){
      this.JsGetInfo()
    }
  }
</script>

<style lang="less" scoped>
  button {
    width: 600rpx;
    margin: 200rpx auto 0;
  }
</style>