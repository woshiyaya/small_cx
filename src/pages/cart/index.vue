<template>
  <view class="wrapper">
    <!-- 收货信息 -->
    <view class="shipment" v-if="address">
      <view class="dt">收货人: </view>
      <view class="dd meta">
        <text class="name">{{address.userName}}</text>
        <text class="phone">{{address.telNumber}}</text>
      </view>
      <view class="dt">收货地址:</view>
      <view class="dd">{{address.addressDetail}}</view>
    </view>

    <button v-else type="primary" @tap="getAddress">获取收货地址</button>
    <!-- 购物车 -->
    <view class="carts">
      <view class="item">
        <!-- 店铺名称 -->
        <view class="shopname">优购生活馆</view>

        <view class="goods" v-for="(item,index) in list" :key="item.goods_id">
          <!-- 商品图片 -->
          <image class="pic" :src="item.goods_small_logo"></image>
          <!-- 商品信息 -->
          <view class="meta">
            <view class="name">{{item.goods_name}}</view>
            <view class="price">
              <text>￥</text>{{item.goods_price}}<text>.00</text>
            </view>
            <!-- 加减 -->
            <view class="amount">
              <text class="reduce" @tap="change(-1,index)">-</text>
              <input type="number" :value="item.goods_number" class="number">
              <text class="plus" @tap="change(1,index)">+</text>
            </view>
          </view>

          <!-- 选框 -->
          <view class="checkbox">
            <icon type="success" 
               size="20" 
               :color="item.goods_buy?'#ea4451':'#ccc'"
               @tap="buy(index)"></icon>
          </view>
        </view>
      </view>
    </view>
    <!-- 其它 -->
    <view class="extra">
      <label class="checkall">
        <icon type="success" :color="is?'#ea4451':'#ccc'" size="20" @tap="ck_all"></icon>
        全选
      </label>
      <view class="total">
        合计: <text>￥</text><label>{{sum}}</label><text>.00</text>
      </view>
      <view class="pay" @tap="goPay">结算({{ckList.length}})</view>
    </view>
  </view>
</template>

<script>
  export default {
    data(){
      return{
        list:[],
        // 收货地址
        address:null
      }
    },
    computed:{
      ckList:function () {
        var arr= [];
        // 对list数组进行遍历，遍历的每一项如果是被选中的话，就放入到arr数组中
        this.list.forEach(item => {
          if(item.goods_buy){
            arr.push(item)
          }
        });
        return arr;
      },
      is:function(){
        return this.list.length==this.ckList.length
      },
      sum:function(){
        var sum = 0;
        this.ckList.forEach(item => {
          sum+=item.goods_price*item.goods_number;
        });
        return sum;
      }
    },
    onShow(){
      this.list = uni.getStorageSync('carts') || []
    },
    methods:{
      change(step,index){

        if(step == -1&&this.list[index].goods_number==1){
           return
        }
         this.list[index].goods_number += step;
         uni.setStorageSync("carts",this.list)
         
      },
      buy(index){
       this.list[index].goods_buy = !this.list[index].goods_buy
       uni.setStorageSync('carts',this.list)
      },
      ck_all(){
        // 拿到全选状态，点击后取反
        var key = !this.is
        this.list.forEach(item =>{
          item.goods_buy = key
        });
        uni.setStorageSync('carts',this.list)
      },
      async getAddress(){
        const [err,res] =await uni.chooseAddress()
        // console.log(res)
        this.address = res
        this.address.addressDetail = res.provinceName + res.cityName + res.countyName + res.detailInfo
      },
     goPay(){
        // 没有地址
        if(!this.address){
          uni.showToast({title:"没有收货地址",icon:"none"})
          return;
        };
        // 没有选择商品
        if(!this.ckList.length){
          uni.showToast({title:"没有选择商品",icon:"none"})
          return;
        };
        // 没有登录
        if(!uni.getStorageSync("token")){
          uni.showToast({title:"未登录",icon:"none"});
          uni.navigateTo({
            url:"/pages/auth/index"
          })
        };
        // console.log(res);
      }

    }
  }
</script>

<style scoped lang="less">
  .shipment {
    height: 100rpx;
    line-height: 2;
    padding: 30rpx 30rpx 40rpx 30rpx;
    font-size: 27rpx;
    color: #333;
    background-color: #fff;
    background-image: url(http://static.botue.com/ugo/images/cart_border%402x.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;

    .dt {
      width: 140rpx;
      float: left;
      clear: both;
    }

    .dd {
      padding-left: 160rpx;
    }

    .meta {
      padding-right: 50rpx;
    }

    text.phone {
      float: right;
    }
  }

  .carts {
    background-color: #f4f4f4;
    padding-bottom: 110rpx;
    overflow: hidden;

    .shopname {
      padding: 30rpx;
      margin-top: 20rpx;
      font-size: 30rpx;
      color: #333;
      background-color: #fff;
      border-top: 1rpx solid #eee;
      border-bottom: 1rpx solid #eee;
    }

    .goods {
      display: flex;
      padding: 30rpx 20rpx 30rpx 0;
      margin-left: 100rpx;
      border-bottom: 1rpx solid #eee;
      background-color: #fff;
  
      position: relative;

      .checkbox {
        width: 101rpx;
        height: 100%;
        background-color: #fff;

        display: flex;
        justify-content: center;
        align-items: center;

        position: absolute;
        left: -100rpx;
        top: 0;
      }

      &:last-child {
        border-bottom: none;
      }

      .pic {
        width: 200rpx;
        height: 200rpx;
        margin-right: 30rpx;
      }

      .meta {
        flex: 1;
        font-size: 27rpx;
        color: #333;
        position: relative;
      }

      .name {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .price {
        position: absolute;
        bottom: 0;

        color: #ea4451;
        font-size: 33rpx;

        text {
          font-size: 22rpx;
        }
      }

      .amount {
        position: absolute;
        bottom: 0;
        right: 20rpx;

        height: 48rpx;
        text-align: center;
        border: 1rpx solid #ddd;
        border-radius: 8rpx;

        display: flex;
        align-items: center;

        text {
          display: block;
          width: 60rpx;
          line-height: 48rpx;
          font-size: 36rpx;
          color: #ddd;
          text-align: center;
        }

        input {
          width: 60rpx;
          height: 48rpx;
          min-height: 48rpx;
          font-size: 27rpx;
          border-left: 1rpx solid #ddd;
          border-right: 1rpx solid #ddd;
        }
      }
    }
  }

  .extra {
    position: fixed;
    bottom: 0;
    /* #ifdef H5 */
    bottom: 50px;
    /* #endif */
    left: 0;
    z-index: 9;

    width: 750rpx;
    height: 96rpx;
    text-align: center;
    line-height: 96rpx;
    font-size: 36rpx;
    border-top: 1rpx solid #eee;
    background-color: #fff;
    color: #333;
    display: flex;

    .checkall {
      width: 140rpx;
      line-height: 1;
      margin-left: 25rpx;
      display: flex;
      align-items: center;

      icon {
        margin-right: 20rpx;
      }
    }

    .total {
      display: flex;
      justify-content: center;
      flex: 1;

      label, text {
        color: #ea4451;
        vertical-align: bottom;
        position: relative;
        bottom: -2rpx;
      }

      text {
        position: relative;
        bottom: -3rpx;
        font-size: 24rpx;

        &:first-child {
          margin-left: 10rpx;
        }
      }
    }

    .pay {
      width: 200rpx;
      background-color: #ea4451;
      color: #fff;
    }
  }
</style>

