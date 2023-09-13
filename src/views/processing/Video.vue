<template>
  <div class="useful">
    <basic_narbar></basic_narbar>
    <div class="columns">

      <div class="column is-one-third list">
        <div class="space">
        </div>
        <ul v-for="item in videoTypes" :key="item.id">
          <li>
            <div class="element-box box notification mar-box" @click="showRightPart(item.id)">
              <div class="video-type-image-box" >
                <figure class="image is-96x96">
                  <img :src="item.profile" alt="Image"/>
                </figure>
              </div>
              <div class="video-type">
                {{item.smallcategory}}
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="column is-two-thirds deal" style="margin-top: 20px; margin-left:20px;" v-if="ifShowRightPart">
        <div>
          <el-upload
              class="oss-upload"
              ref="upload"
              action="anystring"
              :show-file-list="true"
              :on-preview="handlePreview"
              :before-remove="beforeRemove"
              :on-remove="handleRemove"
              :on-exceed="handleExceed"
              :before-upload="beforeUpload"
              :http-request="picUpload"
              :on-success="handleSuccess"
              :on-error = "handleError"
              multiple
              :limit="limitnum"
              :file-list="fileList"
              list-type="picture-card"
              accept=".mp4,.avi">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传avi/mp4文件，且不超过{{limitsize}}MB，一共上传{{limitnum}}个</div>
          </el-upload>
        </div>
        <div>
          <a class="button is-medium is-primary" @click="startdeal2()" style="float:right;background-color:#3d5b89" href="/processing">开始处理</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getVideoType} from "@/api/processing/get_video_type";
import {get_oss} from "@/api/auth/auth";
import {videoUpload} from "@/api/processing/post_video_mes";
import axios from "axios";

export default {
  name: "Video",
  data(){
    return{
      modeltype:1,
      videoTypes:[],
      ifShowRightPart: false,
      limitsize:100,
      limitnum:1,
      videoLink:'',
      videoname:'',
      videomes:{}
    }
  },
  created(){
    this.fetchVideoType()
  },
  methods:{
    async fetchVideoType(){
      getVideoType().then((value)=>{
        this.videoTypes = value
      })
    },
    showRightPart(modeltypeid){
      this.ifShowRightPart = true
      this.modeltype = modeltypeid
    },
    get_suffix(filename) {
      let pos = filename.lastIndexOf('.')
      let suffix = ''
      if (pos !== -1) {
        suffix = filename.substring(pos)
      }
      return suffix
    },
    random_string(len) {
      len = len || 32
      var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
      var maxPos = chars.length
      var pwd = ''
      for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos))
      }
      return pwd
    },
    picUpload(param) {
      let pro = new Promise((resolve, rej) => {
        let res = JSON.parse(localStorage.getItem('sign'))
        let timestamp = Date.parse(new Date()) / 1000
        if (res && timestamp + 3 < res.expire ) {
          resolve(res) //避免服务器压力过大
        } else {
          get_oss(3).then(res => {
            localStorage.setItem('sign', JSON.stringify(res))
            resolve(res)
          }).catch((err) => {
            if (err.response && err.response.data){
              this.$Notice.error({
                title: '获取oss签名错误',
                desc: JSON.stringify(err.response.data)
              });
            }else{
              this.$Notice.error({
                title: '获取oss签名错误',
                desc: "未知错误"
              });
            }
            rej(err)
          })
        }
      })
      pro.then(data => {
        let ossData = new FormData()
        ossData.append('name', param.file.name)
        let filename = param.file.name
        let keyValue = data.dir + this.random_string(20) + this.get_suffix(filename)//之后考虑加入uid
        ossData.append('key', keyValue)
        ossData.append('policy', data.policy)
        ossData.append('OSSAccessKeyId', data.accessid)
        ossData.append('success_action_status', 200)
        ossData.append('signature', data.signature)
        ossData.append('file', param.file, param.file.name)
        axios.post(data.host, ossData, {
          headers: {'Content-Type': 'multipart/form-data'},
          onUploadProgress: event => {
            param.file.percent = event.loaded / event.total * 100
            param.onProgress(param.file)
          },
        })
          .then(res => {
            if (res.status === 200) {
              this.videoLink = data.host + '/' + keyValue
              // 这个URL就是上传后得到的绝对路径
              this.videoname = param.file.name
              param.onSuccess(res)
            }else{
              param.onError(res)
            }
          }).catch(error => {
          this.$Notice.error({
            title: '上传到oss服务器时发生错误',
            desc: "未知错误"
          });
          param.onError(error)
        })
      }).catch(error =>{
        param.onError(error)
      })
    },
    handleRemove(file) {
      if (file && file.status==="success") {
        console.log("handleRemove");
      }
    },
    handleAvatarSuccess() {
      this.$message.info(this.url[1] + "上传成功!")
    },
    beforeAvatarUpload(file) {
      const isvalid = file.type === 'video/mp4' || file.type === 'video/avi';
      const isLt2M = file.size / 1024 / 1024 < this.limitsize;
      if (!isvalid) {
        this.$Notice.error({
          title: '格式错误',
          desc: file.name +  '不符合'
        });
      }
      if (!isLt2M) {
        this.$Notice.error({
          title: '大小错误',
          desc: file.name +  '不符合, 应小于' + this.limitsize + "MB"
        });
      }
      return isvalid && isLt2M;
    },
    handleError(){
      this.$message.error("上传失败，请检查网络，刷新页面");
    },
    startdeal(){
      this.videomes={
        'model_id':this.modeltype,
        'title':'default',
        'docname':this.videoname,
        'data':this.videoLink
      }
      videoUpload(this.videomes).then(()=>{
        this.ifShowRightPart = false
      }).catch((err)=>{
        if(err.response.data){
          this.$message({
            message: err.response.data,
            type: 'warning'
          })
        }else{
          this.$message({
            message: '网络有问题或者服务器未开启',
            type: 'warning'
          })
        }
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
  background-color: #3d5b89;
}
.mar-box{
  margin-bottom: 10px;
}
.video-type-image-box{
  position: absolute;
  left: 10px;
  top:10px;
}
.video-type{
  position: absolute;
  color:#ffffff;
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