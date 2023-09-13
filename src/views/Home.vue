<template>
  <div class="back_pic">

    <basic_narbar></basic_narbar>
    <div class="columns  mar-top">
      <div class="column is-three-fifths">


      </div>
      <div class="column mar-left">
        <div class="notification">
          <strong class="font-bigger"> Hello!</strong>
          <p>Welcome to Easy_Transform!!</p>
        </div>
        <el-carousel indicator-position="outside" :height="imgHeight">
          <el-carousel-item v-for="(item, index) in items" :key="index">
            <div class="lunbo-father">
              <h3 class="item-center item-font">{{ item.describe }}</h3>
              <img :src="item.src" class="image" ref="imgH" alt=""  @load="imgLoad">
            </div>


          </el-carousel-item>
        </el-carousel>
      </div>

    </div>


  </div>
</template>

<script>
  // @ is an alias to /src


  export default {
    name: 'Home',
    data(){
      return{
        isLogin: true,
        imgHeight:'',

        items:[
          {'describe':'进行视频或者图片处理要先登录哦', 'src':require('../../public/picture/LB/LunBo1.jpg')},
          {'describe': '登录信息会过期，过期后请重新登录', 'src':require('../../public/picture/LB/LunBo2.jpg')},
          {'describe': '要保持网络畅通哦，否则信息加载不出来', 'src':require('../../public/picture/LB/LunBo3.jpg')},
        ],
      }
    },
    methods:{
      imgLoad(){
        this.$nextTick(()=>{
          this.imgHeight = `${this.$refs.imgH[0].height}px`;
        })
      }
    },
    mounted () {
      this.imgLoad();
      window.addEventListener("resize",this.imgLoad,false);

    },
    destroyed(){
      window.removeEventListener("resize",this.imgLoad,false);
    },
  }
</script>


<style>
  .mar-top{
    margin-top: 50px;
  }

  .font-bigger{
    font-size: 30px;
  }

  .el-carousel__item h3 {
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }
  .mar-left{
    margin-left: 20px;
  }
  .lunbo-father{
    /*position: relative;*/
  }
  .item-center{
    position:absolute;
    z-index:1000;
    left:20%;

  }
  .item-font{
    color: black;
    font-weight: bold;
  }
  .image{
    opacity:0.5;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

</style>