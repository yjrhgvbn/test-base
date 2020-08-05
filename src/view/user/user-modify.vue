<template>
  <div class="login-container">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm"
             label-position="left" label-width="80px" class="demo-ruleForm login-page">
      <h3 class="title" style="text-align:center">用户注册</h3>
      <el-form-item label="用户名" prop="name">
        <el-input type="text" v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="旧密码" prop="oldPass">
        <el-input type="password" auto-complete="off" placeholder="请输入" v-model="ruleForm.oldPass"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" auto-complete="off" placeholder="请输入" v-model="ruleForm.pass"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" auto-complete="off" placeholder="请输入" v-model="ruleForm.checkPass"></el-input>
      </el-form-item>
      <el-form-item label="邮箱"  prop="email" >
        <el-input placeholder="邮箱" v-model="ruleForm.email"></el-input>
      </el-form-item>
      <el-form-item label="教工号" :disabled="true" >
        <el-input :disabled="true" v-model="this.$store.state.userID"></el-input>
      </el-form-item>
      <el-form-item  style="width:90%;">
        <el-button type="primary" style="width:45%" @click="Visible">取消</el-button>
        <el-button style="width:45%" @click="submitForm('ruleForm')">确定修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data () {
      let validateOldPass = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('旧密码不能为空'))
        }else {
          callback()
        }
      }
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass')
            callback()
          } else {
            callback()
          }
        }
      }
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        ruleForm: {
          oldPass:'',
          pass: '',
          checkPass: '',
          name: this.$store.state.userName,
          email: this.$store.state.userEmail
        },
        rules: {
          oldPass:[{ validator: validateOldPass, trigger: 'blur' }],
          pass: [{ validator: validatePass, trigger: 'blur' }],
          checkPass: [{ validator: validatePass2, trigger: 'blur' }],
          email:[
            { required: false, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ]
        }
      }
    },
    methods: {
      //登录提交
      Visible(){
        this.$emit('sendParent')
      },
      submitForm (formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$ajax.post('/data/user/userModify',
              {
                name:this.ruleForm.name,
                password:this.ruleForm.pass,
                email:this.ruleForm.email,
                userID:this.$store.state.userID,
                oldPass:this.ruleForm.oldPass
              }).then((res) => {
              if (res.data.succeed === false) {
                this.$message({
                  showClose: false,
                  message: res.data.message,
                  type: 'error'
                })
              } else {
                this.$message({
                  showClose: true,
                  message: '修改成功',
                  type: 'success'
                })
                this.Visible()
              }
            })
          } else {
            this.$message({
              showClose: true,
              message: '无效信息',
              type: 'warning'
            });
            return false
          }
        })
      },
      changLogin () {
        this.$refs.ruleForm.validateField('name')
        this.isLogin = !this.isLogin
      }
    },
    mounted(){
      this.ruleForm.name=this.$store.state.userName
    },
    name: 'user-modify'
  }
</script>

<style scoped>
  .login-container {
    width: 100%;
    height: 70%;
  }
  .login-page {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    margin:auto;
    width: 400px;
    padding: 35px 35px 15px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
</style>
