<template>
  <div>
    <basic_narbar></basic_narbar>
    <div class="columns">
      <div class="column is-two-fifths">
        <div>
          <ul v-for="item in allMess" v-bind:key="item.id">
            <li>
              <div class="box comm-box notification is-warning">
                <article class="media">
                  <div class="media-left">
                    <figure class="image is-48x48">
                      <img :src="item.user.profile" class="clip" alt="Image"/>
                    </figure>
                    <div class="if-read">
                      <el-checkbox v-model="checked">已读</el-checkbox>
                    </div>
                  </div>
                  <div class="media-content">
                    <div class="content">
                      <div class="comm-name"><strong>{{ item.user.username }}</strong>&nbsp;在帖子<a @click="goto(item.poster)"><strong>“{{ item.poster_title}}”</strong></a>下评论：</div>
                      <div class="comm-content">{{ item.content|richTextFormat }}</div>
                      <div class="sign-date">
                        <time datetime="2021-3-16">{{ item.date | dateFormat }}</time>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </li>
          </ul>
        </div>
        <div class="page-style" >
          <page :total="allMesCount" :page-size="pageSize" @on-change="changepage" simple></page>
        </div>
      </div>
      <div class="column is-one-fifth"></div>
      <div class="column is-two-fifths">
        <div>
          <ul v-for="item in allKnownMess" v-bind:key="item.id">
            <li>
              <div class="box comm-box notification">
                <article class="media">
                  <div class="media-left">
                    <figure class="image is-48x48">
                      <img :src="item.user.profile" class="clip" alt="Image"/>
                    </figure>
                    <div class="if-read">
                      <p>已读</p>
                    </div>
                  </div>
                  <div class="media-content">
                    <div class="content">
                      <div class="comm-name"><strong>{{ item.user.username }}</strong>&nbsp;在帖子<a @click="goto(item.poster)"><strong>“{{ item.poster_title}}”</strong></a>下评论：</div>
                      <div class="comm-content">{{ item.content|richTextFormat }}</div>
                      <div class="sign-date">
                        <time datetime="2021-3-16">{{ item.date | dateFormat }}</time>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </li>
          </ul>
        </div>
        <div class="page-style" >
          <page :total="allKnownMesCount" :page-size="pageSize" @on-change="changepage2" simple></page>
        </div>
      </div>

    </div>
  </div>

</template>

<script>
import {getUnknownMes} from "@/api/get_unknown_mes";
import {getKnownMes} from "@/api/get_known_mes";
import moment from "moment";

export default {
  name: "Message",
  data(){
    return{
      value:true,
      allMesCount:0,
      allMess:[],
      allKnownMesCount:0,
      allKnownMess:[],
      comments_params : {
        "page" : "1",
        "pageSize" : "20"
      }, //用于过滤和分页
      comments_params2 : {
        "page" : "1",
        "pageSize" : "20"
      }, //用于过滤和分页
      pageSize :20,
      radio: '0'
    }
  },
  created(){
    this.fetchMes()
    this.fetchKnownMes()
  },
  methods:{
    async fetchMes(){
      getUnknownMes(localStorage.getItem('user_id'),this.comments_params2).then((value)=>{
        this.allMesCount = value.count
        this.allMess = value.results
      })
    },
    async fetchKnownMes(){
      getKnownMes(localStorage.getItem('user_id'),this.comments_params).then((value)=>{
        this.allKnownMesCount = value.count
        this.allKnownMess = value.results
      })
    },
    changepage(index){
      //取当前的url，设置page参数为index
      this.comments_params["page"] = index
      this.fetchMes()
    },
    changepage2(index){
      //取当前的url，设置page参数为index
      this.comments_params2["page"] = index
      this.fetchKnownMes()
    },
    goto(id){
      this.$router.push({ path: '/blogdetails/' + id })
    },
  },
  filters:{
    dateFormat(date){
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    richTextFormat(value) {
      // value = value.replace(/<\/?[^>]*>/g,'')
      value = value.replace(/<\/?.+?>/g,'')
      value = value.replace(/\s+/g,'')
      if (value.length > 120) {
        return value.slice(0, 120) + "...";
      }
      return value;
    },
  }
}
</script>

<style scoped>
.page-style{
  margin-top: 15px;
  text-align: center;
}
.comm-content{
  margin-left: 6px;
  margin-top: 6px;
  font-family: "微软雅黑", Arial, sans-serif;
}
.comm-name{
  font-family: 宋体,"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
.content{
  font-size: 15px;
  color: slategray;

}
.sign-date{
  float:right;
  margin-top:5px;
  color: darkslateblue;
  font-size: 13px;
}
.clip{
  width:48px!important;
  height: 48px!important;
  clip-path: circle(50% at 50% 50%)
}
.if-read{
  margin-top: 15px;
}
.box{
  margin-bottom: 10px;
  padding-bottom: 0.5rem;
}
</style>