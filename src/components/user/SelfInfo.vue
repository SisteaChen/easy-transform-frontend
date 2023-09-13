<template>
  <div>
    <div class="card message-part1">
      <div class="card-image">
        <figure class="image is-4by3">
          <el-upload
              class="avatar-uploader"
              action="anystring"
              :show-file-list="false"
              :http-request="picUpload"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :on-error = "handleError"
              accept=".jpg,.png">
            <img :src="url[1]" class="background-image" @click="changeBack()">
          </el-upload>
        </figure>
      </div>
      <div class="card-content">
        <div class="media">
          <div class="media-left">
            <figure class="image is-64x64">
              <el-upload
                  class="avatar-uploader"
                  action="anystring"
                  :show-file-list="false"
                  :http-request="picUpload"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  :on-error = "handleError"
                  accept=".jpg,.png">
                <img :src="url[0]" class="profile-image clip" @click="changeProfile()" alt="Placeholder image">
              </el-upload>
            </figure>
          </div>
          <div class="media-content">
            <p class="title is-4">{{user.name}}</p>
            <p class="subtitle is-6">{{user.name}}</p>
          </div>
        </div>
        <div>
          <div class="content" v-if="!ifChangeSign" @click="EditSign">
            {{ user.sign }}
          </div>
          <div v-else>
            <input class="input is-small" type="text" @keyup.enter="completeSignChange()" placeholder="请输入个性签名" v-model="sign">
          </div>

          <div class="sign-date">
            <time datetime="2021-3-16">{{ user.signEditDate | dateFormat }}</time>
          </div>


        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {get_oss} from '@/api/auth/auth'
import {change_back} from "@/api/auth/auth";
import {get_userinfo} from "@/api/auth/auth";
import {change_profile} from "@/api/auth/auth";
import {change_sign} from "@/api/auth/auth";
import moment from "moment";


export default {
  name: "SelfInfo",
  inject:['reload'],
  data(){
    return{
      user:{
        name:'',
        sign:'',
        signEditDate:''
      },
      isLogin: true,
      showList: [1,2,3,4,5],
      dataCount: 0,
      pageSize: 2,
      fileList: [],
      limitnum: 1,
      limitsize: 6,
      isChangeBack:0,
      url: {
          0:'',
          1:''
      },
      ifChangeSign: false,
      sign:''
    }
  },
  created(){
    this.fetchUserInfo()
  },
  methods:{
    async fetchUserInfo(){
      get_userinfo().then((value)=>{
        this.user.name = value.username
        this.user.sign = value.personalsign
        this.user.signEditDate = value.personalsign_updatetime
        this.url[0] = value.profile
        this.url[1] = value.background
      }).catch((err)=>{
        if (err.response.data){
          console.log(err.response.data)
      }})
    },
    EditSign(){
      this.ifChangeSign = true
    },
    completeSignChange(){
      let signUpload = {}
      signUpload['personalsign'] = this.sign
      change_sign(signUpload).then(()=>{
        setTimeout(() => {
          this.reload()
        },  100)
      })
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
          get_oss(1).then(res => {
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
              this.url[this.isChangeBack] = data.host + '/' + keyValue
              // 这个URL就是上传后得到的绝对路径
              let Pic = {}
              if(this.isChangeBack){
                Pic["background"] = this.url[this.isChangeBack]
                change_back(Pic)
              }
              else{
                Pic["profile"] = this.url[this.isChangeBack]
                change_profile(Pic)
              }
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
      const isvalid = file.type === 'image/jpeg' || file.type === 'image/png';
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
    changeBack(){
      this.isChangeBack = 1 // 修改背景
      console.log(this.url[1])
    },
    changeProfile(){
      this.isChangeBack = 0 // 修改头像
    }
  },
  filters:{
    dateFormat(date){
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
  }

}
</script>

<style scoped>
a {
  color: #7957d5;
  cursor: pointer;
  text-decoration: none;
}
.background-image:hover{
  filter:alpha(Opacity=50);-moz-opacity:0.5;opacity: 0.5
}
.profile-image:hover{
  filter:alpha(Opacity=50);-moz-opacity:0.5;opacity: 0.5
}
.clip{
  width:64px;
  height: 64px;
  clip-path: circle(50% at 50% 50%)
}
.content{
  font-family: 宋体;
  font-size: 15px;
  color: darkslateblue;
}
.sign-date{
  float:right;
  margin-top:10px;
  margin-bottom: 15px;
  color: darkslateblue;
  font-size: 13px;
}
</style>