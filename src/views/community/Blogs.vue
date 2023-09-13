<template>
  <div>
    <basic_narbar></basic_narbar>
    <div class="columns mar-columns">
      <div class="column is-one-fifth">
        <div v-if="has_token" class="card message-part1">
          <div class="card-image">
            <figure class="image is-4by3">
<!--              <img src="/picture/Knuth.png" alt="Placeholder image">-->
              <img :src="url[1]" alt="Placeholder image" >
            </figure>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-left">
                <figure class="image is-64x64">
                  <img :src="url[0]" alt="Placeholder image" class="clip">
                </figure>
              </div>
              <div class="media-content">
                <p class="title is-4">{{user.name}}</p>
                <p class="subtitle is-6">{{user.name}}</p>
              </div>
            </div>
            <div class="sign-content">
              {{ user.sign }}
              <div class="sign-date">
                <time datetime="2021-3-16">{{ user.signEditDate | dateFormat }}</time>
              </div>
            </div>
          </div>
        </div>
        <div class="message-part box">
          <sentence></sentence>
        </div>
      </div>
      <div class="column is-four-fifths mar-lef-20">
        <div class="columns">
          <div class="column is-one-fifth">
            <div class="control">
              <input class="input" v-model="searchTitle" type="text" placeholder="查找标题" />
            </div>
          </div>

          <div class="column is-two-fifths">
            <div class="control">
              <input class="input" v-model="searchContent" type="text" placeholder="查找帖子" />
            </div>
          </div>
          <div class="column is-two-fifths">
            <button class="button is-primary" @click="search()">
              <span>Search</span>
            </button>
          </div>
        </div>
        <div class="columns">
          <div class=" column is-8">
            <div class="box to-write" >
              <a href="/blogwrite" class="margin-wri">
                <i class="el-icon-edit-outline"></i>
                点击写博客
              </a>
            </div>
            <div>
              <ul v-for="item in blogsData" v-bind:key="item.id">
                <li>
                  <div class="box" @click="goto(item.id)" style="cursor:default">
                    <article class="media">
                      <div class="media-content">
                        <div class="content">
                          <div class="mar-bot">
                            <strong> {{ item.title }}</strong>
                          </div>
                          <div class="content-size">
                            {{item.content | richTextFormat}}
                          </div><br>
                          <div>
                            <span><i class="el-icon-chat-line-round"></i></span>
                            <div class="kaoyou">
                              <span><i class="el-icon-user"></i></span>
                              <strong>{{ item.user.username }}</strong>
                              &nbsp;
                              <span><i class="el-icon-time"></i></span>
                              <small>{{ item.date | dateFormat}}</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <page :total="blogsCount" :page-size="pageSize" @on-change="changepage" simple></page>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sentence from "@/components/communitypart/Sentence";
import {getBlogs} from "@/api/get_all_blogs";
import {get_userinfo} from "@/api/auth/auth";
import moment from 'moment'

export default {
  name: "Blogs",
  data(){
    return{
      has_token: localStorage.getItem('token') != null,
      blogClassify : ['Hot', 'Follow', 'OwnSpace'],
      currentIndex : 0,
      drawer : false,
      searchTitle : "",
      searchContent: "",
      blogsCount : 0,
      blogsData : [],
      pageSize : 4,
      blogs_params : {
        "page" : "1",
        "pageSize" : "4"
      }, //用于过滤和分页
      url: {
        0:'',
        1:''
      },
      user:{
        name:'',
        sign:'',
        signEditDate:''
      },
    }
  },
  filters: {
    richTextFormat(value) {
      // value = value.replace(/<\/?[^>]*>/g,'')
      value = value.replace(/<\/?.+?>/g,'')
      value = value.replace(/\s+/g,'')
      if (value.length > 120) {
        return value.slice(0, 120) + "...";
      }
      return value;
    },
    dateFormat(date){
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  created() {
    this.fetchBlogs()
    this.fetchUserInfo()
  },
  methods: {
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
    async fetchBlogs() {
      getBlogs(this.blogs_params).then((value) => {
        this.blogsData = value.results
        this.blogsCount = value.count
      })
    },

    goto(id){
      this.$router.push({ path: '/blogdetails/' + id })
    },
    changepage(index){
      //取当前的url，设置page参数为index
      this.blogs_params["page"] = index
      this.fetchBlogs()
    },
    search(){
      //设置blogs_params,其中page默认是1
      this.blogs_params["page"] = "1"
      this.blogs_params["title"] = this.searchTitle
      this.blogs_params["content"] = this.searchContent
      this.fetchBlogs()
    }
  },
  components:{
    sentence: Sentence
  }
}

</script>

<style scoped>
.search-box{
  border: 2px solid grey;
  border-radius: 10px;
  /*// display: inline;*/
}
a {
  color: #7957d5;
  cursor: pointer;
  text-decoration: none;
}
.to-write{
  font-size: 14px;
}
.margin-wri{
  margin-left: 20px;
}
.mar-bot{
  margin-bottom: 0.5rem;
  font-size: 15px;
}
.content-size{
  font-size: 14px;
}
.clip{
  width:64px;
  height: 64px;
  clip-path: circle(50% at 50% 50%)
}
.sign-content{
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
.box{
  margin-bottom: 10px;
}
.mar-columns {
  margin-left: -2.55rem;
  margin-right: -2.55rem;
  margin-top: -0.55rem;
}
.message-part{
  margin-top: 20px;
}
.kaoyou{
  float: right;
}
.mar-lef-20{
  margin-left: 20px;
}
</style>