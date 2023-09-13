<template id="base_narbar">
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        <!--        <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28">-->
        <img src="/picture/logo/1.png">
      </a>

      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-start">
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            Media Processing
          </a>

          <div class="navbar-dropdown">
            <a class="navbar-item" href="/videoprocess">
              Video
            </a>
            <a class="navbar-item" href="/imageprocess">
              Picture
            </a>
            <hr class="navbar-divider">
            <a class="navbar-item">
              Report an issue
            </a>
          </div>
        </div>

        <a class="navbar-item" href="/blogs">
          Community
        </a>

        <a v-if="has_token" class="navbar-item" href="/message">
          Message
          <Icon type="logo-twitch" color="#7957d5" v-if="hasUnknownMes"/>
        </a>
      </div>
      <div class="navbar-end">
        <div v-if="has_token" class="navbar-item">
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              Processing progress
            </a>
            <div class="navbar-dropdown">
              <ul v-for="item in allDealMedia" :key="item.id">
                <li>
                  <a class="navbar-item" :href="item.result">
                    【{{item.model.smallcategory}}】{{item.docname}}
                  </a>
                </li>
              </ul>
              <hr class="navbar-divider">
              <a class="navbar-item">
                Download All Processed
              </a>
            </div>
          </div>
        </div>

        <div v-if="has_token" class="navbar-item navbar-more">
          <a href="/homepage">
            <img :src="profile" alt="Profile" class="clip">
          </a>

        </div>

        <div class="navbar-item">
          <div v-if="has_token">
            <a class="button is-primary" @click="logOut()">
              Log out
            </a>
          </div>
          <div v-else>
            <div class="buttons">
              <a class="button is-primary" href="/register">
                <strong>Sign up</strong>
              </a>
              <a class="button is-light" href="/login">
                Log in
              </a>
            </div>
          </div>
        </div>
      </div>

      </div>
  </nav>
</template>

<script>
import {get_userinfo} from "@/api/auth/auth";
import {getAllMedia} from "@/api/processing/get_all_media";

export default {
  name: 'base_html',
  data(){
    return{
      has_token: localStorage.getItem('token') != null,
      username: localStorage.getItem('username'),
      profile: '',
      hasUnknownMes:true,
      allDealMedia:'',
    }
  },
  created() {
    this.fetchProfile()
    this.fetchAllMedia()
  },
  methods:{
    logOut(){
      localStorage.clear()
      sessionStorage.clear()
      this.has_token = false
      this.$message({
        message: '账号退出成功',
        type: 'success',
        duration: 1*1000
      })
    },
    async fetchProfile(){
      if(this.has_token){
        get_userinfo().then((value)=>{
          this.profile = value.profile
        }).catch((err)=>{
          if(err.response.data){
            this.$message({
              message: '获取用户头像失败',
              type: 'warning'
            })
          }})
      }
    },
    async fetchAllMedia(){ // 点击事件
      getAllMedia().then((value)=>{
        this.allDealMedia = value.results

      }).catch((err)=>{
        if(err.response.data){
          this.$message({
            message: '获取媒体文件失败',
            type: 'warning'
          })
        }})
    }
  },
}

</script>

<style>
.navbar{
  margin-bottom: 30px;
  margin-left: -2.55rem;
  margin-right: -2.55rem;
}
.clip{
  width:48px!important;
  height: 48px!important;
  clip-path: circle(50% at 50% 50%)
}
.navbar-item{
  font-size: 15px;
}
.navbar-more img{
  max-height: 48px;
}
.navbar-more{
  margin-right:10px;
}

</style>