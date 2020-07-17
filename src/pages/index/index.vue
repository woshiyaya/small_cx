<template>
  <view :style="{height: pageHeight, overflow: 'hidden'}">
    <search @search="disableScroll" />
    <!-- 焦点图 -->
    <swiper class="banner" indicator-dots indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#fff">
      <swiper-item v-for="item in swiperArr" :key="item.goods_id" >
        <navigator :url="'/pages/goods/index?id='+item.goods_id">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 导航条 -->
    <view class="navs">
      <navigator 
       v-for="item in navArr"
       :key="item.name"
       open-type="switchTab" 
       :url="itme.navigator_url">
        <image :src="item.image_src"></image>
      </navigator>
    
    </view>
    <!-- 楼层 -->
    <view class="floors">
       <!-- v-for="(item,index) in floorArr" :key="index" -->
      <view class="floor" v-for="(item,index) in floorArr" :key="index">
        <view class="title">
          <image :src="item.floor_title.image_src"></image>
        </view>
        <view class="items">
          <navigator 
             v-for="one in item.product_list" 
             :key="one.name"
             :url="one.navigator_url">
            <image :src="one.image_src"></image>
          </navigator>
        </view>
      </view>
    </view>
    <!-- 回到顶部 -->
    <view class="goTop icon-top" 
       v-if="height>200?true:false"
       @click="goTop"></view>
  </view>
</template>

<script>
  import search from '@/components/search';

  export default {

    data () {
      return {
        pageHeight: 'auto',
        swiperArr:[],
        navArr:[],
        floorArr:[],
        // isShow:false
        height:0
      }
    },

    components: {
      search
    },
    
    methods: {
      disableScroll (ev) {
        this.pageHeight = ev.pageHeight + 'px';
      },
      // 获取轮播图数据
     async getSwiperData(){
      const res =  await this.request({
           url:'/api/public/v1/home/swiperdata'
         })
      // console.log(res)
      this.swiperArr = res
      },
    //  获取导航数据
     async getNavData(){
        const navData = await this.request({
          url:'/api/public/v1/home/catitems'
        })
        // console.log(navData)
        this.navArr = navData
     },
    //  获取楼层数据
     async getFloorData(){
       const floorData = await this.request({
         url:'/api/public/v1/home/floordata'
       })
      //  console.log(floorData)
      this.floorArr = floorData
     },
      // 回到顶部
    goTop(){
      uni.pageScrollTo({scrollTop:0})
    }
    },
    // 在哪儿执行函数，调用函数
    onLoad(){
      this.getSwiperData(),
      this.getNavData(),
      this.getFloorData()
      // 分享
      // uni.showShareMenu()
    },
    // 下拉行为事件函数
    async  onPullDownRefres(){
     await this.getSwiperData(),
     await this.getNavData(),
     await this.getFloorData()

      // 关闭下拉效果
      uni.stopPullDownRefresh()
    },
    // 页面滚动的时候
    onPageScroll(e){
      // e.scrollTop获取到卷起的高度
      // if(e.scrollTop>200){
      //   this.isShow = true
      // }else{
      //   this.isShow = false
      // }
      this.height = e.scrollTop
    },
    // 页面转发
    onShareAppMessage () {
    return {
        title: '欢迎使用UGO!',
        imageUrl: 'http://www.999zx.cn/adm_file/fck/images/2018/4/Image/20184386447866.jpg',
        path: '/pages/index/index'
    }
}
  }
</script>

<style scoped lang="less">
  .banner {
    width: 100%;
    height: 340rpx;

    image {
      width: 100%;
      height: 340rpx;
    }
  }

  .navs {
    display: flex;
    justify-content: space-between;
    padding: 30rpx 44rpx;

    image {
      width: 128rpx;
      height: 140rpx;
    }
  }

  .floor {

    .title {
      width: 750rpx;
      height: 60rpx;
      padding: 20rpx 0 0 8rpx;
      background-color: #f4f4f4;
    }

    .items {
      padding: 20rpx 16rpx;
      overflow: hidden;

      navigator {
        width: 193rpx;
        height: 188rpx;
        margin-left: 10rpx;
        margin-bottom: 10rpx;
        float: left;
      }

      navigator:first-child {
        width: 232rpx;
        height: 386rpx;
        margin-left: 0rpx;
      }

      navigator:nth-child(2),
      navigator:nth-child(5) {
        width: 273rpx;
      }
    }

    &:first-child {

      .items {

        navigator {
          width: 233rpx;
        }
      }
    }
  }

  .goTop {
    position: fixed;
    bottom: 30rpx;
    /* #ifdef H5 */
    bottom: 65px;
    /* #endif */
    right: 30rpx;
  
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100rpx;
    height: 100rpx;
    font-size: 48rpx;
    color: #666;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.8);
  }
</style>