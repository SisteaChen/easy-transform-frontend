<template>
  <div class="columns py-6">
    <div class="column is-half is-offset-one-quarter">
      <el-card shadow="never">
        <div slot="header" class="has-text-centered has-text-weight-bold">
          新用户入驻
        </div>
        <div>
          <el-form
          ref="ruleForm"
          v-loading="loading"
          :model="ruleForm"
          status-icon
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm form_style" >

            <el-form-item label="账号" prop="name">
              <el-input v-model="ruleForm.name"  clearable/>
            </el-form-item>

            <el-form-item label="密码" prop="pass">
              <el-input v-model="ruleForm.pass"
              type="password"
              autocomplete="off"
              clearable
              />
            </el-form-item>

            <el-form-item label="确认密码" prop="checkPass">
              <el-input v-model="ruleForm.checkPass"
                        type="password"
                        autocomplete="off"
                        clearable
              />
            </el-form-item>

            <el-form-item label="手机号码" prop="phoneNum">
              <div class="columns">
                <div class="column is-three-quarters">
                  <el-input v-model="ruleForm.phoneNum" autocomplete="off" clearable/>
                </div>
                <div class="column is-one-quarters">
                  <el-button @click="submitPhonenum()">{{ sms_code_tip }}</el-button>
                </div>
              </div>


            </el-form-item>
            <el-form-item label="验证码" prop="SMS_vc">
              <el-input v-model="ruleForm.SMS_vc"  autocomplete="off" clearable/>
            </el-form-item>

            <el-form-item>

              <el-button class="regi_button"
                type="primary"
                @click="submitForm('ruleForm')">
                立即注册
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
  import {userRegister} from '@/api/auth/auth'
  import {send_SMS} from '@/api/auth/auth'

  export default {
    name: "Register",
    data(){
      const validataPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
      const validataPhoneNum = (rule, value, callback) => {
        let template = /^1[3456789]\d{9}$/;
        if (template.test(value)) {
          callback()
        } else {
          callback('请输入正确的手机号码格式')
        }
      }
      return{
        useless:[],
        error_phone: false,
        sending_flag: false,
        loading: false,
        sms_code_tip: '获取验证码',
        ruleForm:{
          name: '',
          pass: '',
          checkPass: '',
          phoneNum: '',
          SMS_vc: '',
        },
        rules: {
          name: [
            { required: true, message: '请输入账号昵称', trigger: 'blur'},
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
          checkPass: [
            { required: true, message: '请输入确认密码', trigger: 'blur'},
            { validator: validataPass, trigger: 'blur'}
          ],
          phoneNum: [
            { required: true, message: '请输入手机号码', trigger: 'blur'},
            {
              message: '请输入正确的手机号码',
              validator: validataPhoneNum,
              trigger: ['blur', 'change'],
            }
          ],
          SMS_vc:[
            {required: true, message: '请输入验证码', trigger: 'blur'},
            {
              min: 6,
              max: 6,
              message: '请输入正确的验证码格式（长度为6）',
              trigger: 'blur',
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
            let subForm = {
              username: this.ruleForm.name,
              password: this.ruleForm.pass,
              password2: this.ruleForm.checkPass,
              mobile: this.ruleForm.phoneNum,
              sms_code: this.ruleForm.SMS_vc,
              allow: 'true',
            }
            userRegister(subForm)
            .then((value) => {
              sessionStorage.clear();
              localStorage.clear();
              localStorage.token = value.access;
              console.log(value.access);
              console.log(localStorage.token);
              localStorage.username = value.username;
              localStorage.user_id = value.id;
              this.$message({
                message: '账号注册成功',
                type: 'success'
               })
              setTimeout(() => {
                this.loading = false
                this.$router.push({ path: this.redirect || '/' })
              }, 2 * 1000)
            })
            .catch((err)=>{
              if (err.response.data){
                console.log(err.response.data)
              }
            })
            this.loading = false
          }
        })
      },
      submitPhonenum(){
          if (this.sending_flag === true) {
            return;
          }
          this.sending_flag = true;

          if (this.error_phone === true) {
            this.sending_flag = false;
            return;
          }
        send_SMS(this.ruleForm.phoneNum).then(response => {
          // 表示后端发送短信成功
          // 倒计时60秒，60秒后允许用户再次点击发送短信验证码的按钮
          this.useless = response
          let num = 60
          // 设置一个计时器
          let t = setInterval(() => {
            if (num === 1) {
              // 如果计时器到最后, 清除计时器对象
              clearInterval(t)
              // 将点击获取验证码的按钮展示的文本回复成原始文本
              this.sms_code_tip = '获取验证码'
              // 将点击按钮的onclick事件函数恢复回去
              this.sending_flag = false
            } else {
              num -= 1
              // 展示倒计时信息
              this.sms_code_tip = '获取验证码' + '('+num + '秒'+')'
            }
          }, 1000, 60)
        })

      }
    }

  }
</script>

<style>
.regi_button{
  float: right;
  margin-right: 10px;
  margin-top: 15px;
}

.form_style{
  margin-right: 15px;
}

.column.is-three-quarters{
  flex: auto;
  /*position: relative;*/
  /*padding-bottom: 0!important;*/
}
.el-form-item__content::before, .el-form-item__content::after{
  display: inline;
}
</style>