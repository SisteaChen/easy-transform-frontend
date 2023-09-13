<template>
  <div class="useful">
    <basic_narbar></basic_narbar>
    <div class="columns">
      <div class="column is-one-third list">
        <div class="space"></div>
        <ul v-for="item in imageTypes" :key="item.id">
          <li>
            <div class="element-box box notification mar-box">
              <div class="image-type-image-box">
                <figure class="image is-96x96">
                  <img :src="item.profile" alt="Image"/>
                </figure>
              </div>
              <div class="image-type">
                {{item.smallcategory}}
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="column is-two-thirds deal">

      </div>
    </div>
  </div>
</template>

<script>
import {getImageType} from "@/api/processing/get_image_type";

export default {
  name: "Image",
  data(){
    return{
      imageTypes:[],
    }
  },
  created(){
    this.fetchImageType()
  },
  methods:{
    async fetchImageType(){
      getImageType().then((value)=>{
        this.imageTypes = value
      })
    }
  }

}
</script>

<style scoped>
.element-box{
  position: relative;
  height: 115px;
  width: 300px;
  margin:0 auto;
  background-color: #fdfdf4;
}
.mar-box{
  margin-bottom: 10px;
}
.image-type-image-box{
  position: absolute;
  left: 10px;
  top:10px;
}
.image-type{
  position: absolute;
  color: #52524f;
  left:140px;
  top: 45px;
  font-family: 宋体,"微软雅黑", Arial, sans-serif;
  font-size:19px;
  font-weight: bold;
}
.space{
  margin-top: 20px;
  margin-bottom: 20px;
}


</style>