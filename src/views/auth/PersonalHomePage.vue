<template>
  <div>
    <basic_narbar></basic_narbar>
    <div class="columns mar-columns">
      <div class="column is-one-fifth">
        <selfinfo></selfinfo>
        <div class="message-part box">
          <sentence></sentence>
        </div>
      </div>
      <div class="column is-four-fifths mar-lef-20">
        <div class="columns">
          <div class="column is-8">
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
import SelfInfo from "@/components/user/SelfInfo";
import {getUsersBlogs} from "@/api/get_users_blogs";
import moment from 'moment'

export default {
  name: "PersonalHomePage",
  data(){
    return{
      // blogClassify : ['Hot', 'Follow', 'OwnSpace'],
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
  },
  methods: {
    async fetchBlogs() {
      // alert(localStorage.user_id)
      getUsersBlogs(localStorage.user_id,this.blogs_params).then((value) => {
        this.blogsData = value.results
        this.blogsCount = value.count
        console.log(value.results)
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
    // search(){
    //   //设置blogs_params,其中page默认是1
    //   this.blogs_params["page"] = "1"
    //   this.blogs_params["title"] = this.searchTitle
    //   this.blogs_params["content"] = this.searchContent
    //   this.fetchBlogs()
    // }
  },
  components:{
    sentence: Sentence,
    selfinfo: SelfInfo,
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