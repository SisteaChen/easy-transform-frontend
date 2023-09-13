<template>
  <div>
    <basic_narbar></basic_narbar>
    <div class="columns mar-columns">
      <div class="column is-one-fifth">
        <div class="card message-part1">
          <div class="card-image">
            <figure class="image is-4by3">
              <!--              <img src="/picture/Knuth.png" alt="Placeholder image">-->
              <img :src="blogerMes.background">
            </figure>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-left">
                <figure class="image is-48x48">
                  <img :src="blogerMes.profile" class="clip" alt="Placeholder image">
                </figure>
              </div>
              <div class="media-content">
                <p class="title is-4">{{ blogerMes.name }}</p>
                <p class="subtitle is-6">{{ blogerMes.name }}</p>
              </div>
            </div>
            <div class="sign-content">
              {{ blogerMes.personalSign }}
<!--              <a href="https://www-cs-faculty.stanford.edu/~knuth/"></a>-->
              <br>
              <div class="sign-date">
                <time datetime="2021-3-16">{{ blogerMes.editSignDate | dateFormat }}</time>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div class="column is-two-fifths mar-lef-40 posi">
        <div class="blog-title">
          {{blogTitle}}
        </div>
        <div class="oneline">
          <div class="blog-date">
            <i class="el-icon-time"></i>
            {{date | dateFormat}}
          </div>
          <div class="blog-delete" v-if="canBeDelete" @click="deleteB()">
            <i class="el-icon-delete"></i>
          </div>
        </div>
        <div class="blog-content" v-html="blogsContent"></div>
        <img :src="blogpicUrl" v-if="ifHasPic" alt="Image">
        <div class="comm">
          <div @click="CommentOrNot()">
            <Button class="btn" type="primary" shape="circle" icon="md-add" >
            </Button>
          </div>
          <div v-if="ifClick" class="control comm-text">
            <p class="pinglin">评论"&nbsp;{{blogerMes.name}}&nbsp;":</p>
            <textarea class="textarea has-fixed-size" placeholder="说些什么吧" v-model="writeComment"></textarea>
            <button class="button is-primary is-small sub-btn" @click="submitComment()">submit</button>
          </div>
        </div>
      </div>
      <div class="column is-two-fifths mar-lef-40">
        <div class="columns comm-list">
          <div class="column is-9">
            <div>
              <ul v-for="item in commentsData" v-bind:key="item.id">
                <li>
                  <div class="box comm-box">
                    <article class="media">
                      <div class="media-left">
                        <figure class="image is-48x48">
                          <img :src="item.user.profile" alt="Image" class="clip"/>
                        </figure>
                      </div>
                      <div class="media-content">
                        <div class="content">
                          <div class="comm-name"><strong>{{ item.user.username }}</strong> <small> {{item.date | dateFormat}}</small></div>
                          <div class="comm-content">{{ item.content }}</div>
                        </div>
                      </div>
                    </article>
                  </div>
                </li>
              </ul>
            </div>
            <div class="page-style" v-if="!ifCommentZero">
              <page :total="commentsCount" :page-size="pageSize" @on-change="changepage" simple></page>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {gotoBlog} from "@/api/goto_blog";
import {post_Comment} from "@/api/post_comment";
import {getComments} from "@/api/get_comments";
import {deleteBlog} from "@/api/delete_blog";

import moment from "moment";

export default {
  name: "BlogDetails",
  data(){
    return {
      blogTitle: '',
      blogsContent:'',
      blogpicUrl:'',
      ifHasPic:false,
      date: '',
      bloger_id:'',
      canBeDelete:false,
      blogerMes:{
        name:'',
        personalSign:'',
        profile:'',
        background:'',
      },
      ifClick: false,
      writeComment: '',
      comments_params : {
        'pid': this.$route.params.id,
        "page" : "1",
        "pageSize" : "5"
      }, //用于过滤和分页
      commentsData: [],
      commentsCount: 0,
      pageSize :5,
      commenterImg:"https://5b0988e595225.cdn.sohucs.com/images/20190904/950c0582e4394d8cb516858db3851efb.jpeg",
      ifCommentZero: true,
    }
  },
  created(){
    this.fetchBlog()
    this.fetchComments()
  },
  methods: {
    async fetchBlog() {
      gotoBlog(this.$route.params.id).then((value) => {
        this.blogTitle = value.title
        this.blogsContent = value.content
        this.blogpicUrl = value.blog_pic
        this.blogerMes.name = value.user.username
        this.blogerMes.personalSign = value.user.personalsign
        this.blogerMes.editSignDate = value.user.personalsign_updatetime
        this.blogerMes.profile = value.user.profile
        this.blogerMes.background = value.user.background
        this.date = value.date
        const usera = localStorage['user_id']
        if(usera === String(value.user.id)){
          this.canBeDelete = true
        }
        if(this.blogpicUrl !== 'nopic'){
          this.ifHasPic = true
        }
      })
    },
    deleteB(){
      deleteBlog(this.$route.params.id).then(()=>{
        setTimeout(() => {
          this.$router.push({path: '/blogs/'})

        },  1000)
        this.$message({
          message: '删除博客成功',
          type: 'success',
          duration:500
        })
        }
      ).catch((err)=>{
        if (err.response.data){
          console.log(err.response.data)
        }
      })

    },
    CommentOrNot: function () {
      this.ifClick = !this.ifClick
    },
    submitComment() {
      if (this.writeComment === '') {
        alert('评论内容不能为空，请重新输入')
        this.ifClick = true
        this.$router.push({path: '/blogdetails/' + this.$route.params.id})
      }
      let mes = {
        'content': this.writeComment,
        'poster': this.$route.params.id
      }
      post_Comment(mes).then(() => {
        setTimeout(() => {
          this.writeComment = ''
          this.ifClick = false
        },  1000)
        this.$message({
          message: '评论发表成功',
          type: 'success',
          duration:500
        })
        this.fetchComments()
      }).catch((err) => {
        if (err.response.data) {
          console.log(err.response.data)
        }
      })
    },
    async fetchComments(){
      getComments(this.comments_params).then((value)=>{
        this.commentsData = value.results
        this.commentsCount = value.count
        if(this.commentsCount === 0){
          this.ifCommentZero = true
        }
        else {
          this.ifCommentZero = false
        }
      })
    },
    changepage(index){
      //取当前的url，设置page参数为index
      this.comments_params["page"] = index
      this.fetchComments()
    },
  },
  filters: {
    dateFormat(date){
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
  },
}
</script>

<style scoped>
.mar-columns {
  margin-left: -2.55rem;
  margin-right: -2.55rem;
  margin-top: -0.55rem;
}
.mar-lef-40{
  margin-left: 80px;
  /*border:2px solid dimgrey;*/
  border-radius: 10px;
}

.comm{
  display: inline-block;
  position:fixed;
  top:150px;
  left: 62%;
  z-index:100;
}
.pinglin{
  font-family: Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  margin: 2px 0 3px 0;
}
.comm-text{
  margin-left: 30px;
  padding:5px 10px 10px 10px;
  border:2px solid #7957d5;
  border-radius: 10px;
  background-color: white;
}
.has-fixed-size{
  width: 400px;
  height: 155px;
}
.sub-btn{
  float: right;
  margin-top: 10px;
  margin-bottom: 10px;
}
.btn{
  background-color: #7957d5;
  border-color: #7957d5;
}

.blog-title{
  font-size: 25px;
  margin-bottom: 10px;
}
.oneline{
  display: inline;
}
.blog-date{
  color: darkslateblue;
  font-size: 13px;
  float: left;
}
.blog-delete{
  margin-left:20px;
  color: darkslateblue;
  font-size: 13px;
  float: left;
}
.blog-content{
  font-family: KaiTi_GB2312, SimHei, Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  margin-top: 3rem;
  font-size: 17px;
  line-height: 150%;
}
.comm-list{
  margin-top: 60px;
}
.comm-box{
  margin-top: 5px;
  padding: 14px 14px 14px 14px;
}
.comm-name{
  margin-bottom: 5px;
  font-size: 14px;
}
.comm-content{
  padding-top: 2px;
}
.page-style{
  margin-top: 10px;
  text-align: center;
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
</style>