<template>
  <div class="columns py-6">
    <div class="column is-half is-offset-one-quarter">
      <el-card shadow="never">
        <div slot="header" class="has-text-centered has-text-weight-bold">
          用户登录
        </div>
        <div>
          <el-form
              ref="loginForm"
              v-loading="loading"
              :model="loginForm"
              status-icon
              :rules="rules"
              label-width="100px"
              class="demo-ruleForm form_style" >
            <el-form-item label="账号或手机号" prop="username">
              <el-input v-model="loginForm.username"/>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="loginForm.password"
                        type="password"
                        autocomplete="off"
                        clearable/>
            </el-form-item>
            <el-form-item>
              <el-button class="regi_button"
                         type="primary"
                         @click="submitForm('loginForm')">
                立即登录
              </el-button>
              <!--              <el-button @click="resetForm('ruleForm')">重置</el-button>-->
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {userLogin} from '@/api/auth/auth'

export default {
  name: "Login",
  data(){
    return{
      loading: false,
      loginForm: {
        username: '',
        password: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入账号或者手机号', trigger: 'blur'},
          {
            min: 3,
            max: 20,
            message: '长度3到20个字符',
            trigger: "blur"
          }
        ],

        pass: [
          { required: true, message: '请输入密码', trigger: 'blur'},
          {
            min: 6,
            max: 20,
            message: '长度6到20个字符',
            trigger: "blur"
          }
        ],
      }
    }
  },
  methods:{
    submitForm(formName){
      console.log('goin submit form process')
      this.$refs[formName].validate((valid) => {
        if (valid){
          console.log('vaild')
          this.loading = true
          userLogin(this.loginForm)
              .then((value) => {
                sessionStorage.clear();
                localStorage.clear();
                localStorage.token = value.access;
                console.log(value.access);
                console.log(localStorage.token);
                localStorage.username = value.username;
                localStorage.user_id = value.user_id;
                this.$message({
                  message: '账号登录成功',
                  type: 'success',
                  duration: 1*1000
                })
                setTimeout(() => {
                  this.loading = false
                  this.$router.push({ path: this.redirect || '/' })
                }, 1 * 1000)
              })
              .catch((err)=>{
                if (err.response.data != null){
                  this.$message({
                    message:err.response.data,
                    type: 'error',
                    duration: 2*1000
                  })
                }
              })
          this.loading = false
        }
      })
    },
  }
}
</script>

<style scoped>

</style>