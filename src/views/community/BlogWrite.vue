<template>
  <div class="columns mar-col">
    <div class="column is-one-fifth"></div>
    <div class="box column is-three-fifths">
      <input class="input is-medium" type="text" placeholder="请输入标题" v-model="title">
      <div>
        <quill-editor
        v-model="content"
        ref="myQuillEditor"
        :options="editorOption"
        />
      </div>
    </div>
    <div class="column is-one-fifth">
      <button class="button" @click="submitBlog()">Submit</button>
      <p v-html="content"> </p>
    </div>
  </div>
</template>

<script>
import 'quill/dist/quill.snow.css'
import {quillEditor} from 'vue-quill-editor'
import {blogPost} from "@/api/post_blog";
import quillConfig from "@/quill-config"
// import {Button, Input, Select} from 'iview'

export default {
  name: "BlogWrite",
  components:{
    // Button,
    // Input,
    // Select,
    quillEditor
  },
  data: () => ({
    content: '',
    title:'',
    editorOption: quillConfig,
    blogpic:'nopic',
  }),
  created() {
    this.clearSession()
  },
  methods:{
    clearSession(){
      sessionStorage.clear()
    },
    submitBlog(){
      if(sessionStorage.blog_pic){
        this.blogpic = sessionStorage.blog_pic
      }
      if(this.title === '' || this.content === ''){
        alert('标题或者博客内容不能为空，请重新输入')
      }
      else{
        let blogData = {
            title: this.title,
            content: this.content,
            blog_pic: this.blogpic
        }
        blogPost(blogData).then(() => {
          this.$message({
            message: '发表成功',
            type: 'success'
          })
          setTimeout(() => {
            this.loading = false
            this.$router.push({ path: this.redirect || '/blogs' })
          }, 2 * 1000)
        }).catch((err)=>{
          if (err.response.data){
            console.log(err.response.data)
          }
        })
      }
    }
  }
}


</script>

<style>
.mar-col{
  margin-top: 1rem;
}
.input:focus{
  border-color:#7957d5;
  box-shadow:black;
  border-width: 2px;
}
.ql-editor {
  height: 72vh;
}

</style>