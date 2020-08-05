<template>
  <div class="login-container">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm"
      label-position="left" label-width="80px" class="demo-ruleForm login-page">
      <h3 v-if="isLogin" class="title" style="text-align:center">用户登录</h3>
      <h3 v-else class="title" style="text-align:center">用户注册</h3>
      <el-form-item label="用户名" prop="name">
        <el-input type="text" auto-complete="off" placeholder="用户名" v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" auto-complete="off" placeholder="密码" v-model="ruleForm.pass"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" v-if="!isLogin" prop="checkPass">
        <el-input type="password" auto-complete="off" placeholder="确认密码" v-model="ruleForm.checkPass"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" v-if="!isLogin" prop="email" >
        <el-input placeholder="邮箱" v-model="ruleForm.email"></el-input>
      </el-form-item>
      <el-form-item label="教工号" v-if="!isLogin" prop="userID">
        <el-input placeholder="教工号" v-model="ruleForm.userID"></el-input>
      </el-form-item>
      <el-form-item v-if="isLogin" style="width:90%;">
        <el-button type="primary" style="width:45%" @click="submitForm('ruleForm')">提交</el-button>
        <el-button style="width:45%" @click="changLogin">前往注册</el-button>
      </el-form-item>
      <el-form-item v-else style="width:90%;">
        <el-button type="primary" style="width:45%" @click="registerForm('ruleForm')">提交</el-button>
        <el-button style="width:45%" @click="changLogin">前往登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {

  data () {
    let checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户名不能为空'))
      }
      setTimeout(() => {
        let is = this.isLogin
        this.$ajax
          .post('/data/checkUser', { userName: this.ruleForm.name })
          .then(function (res) {
            if (res.data.exist === true && !is) {
              callback(new Error('用户名已存在'))
            } else if (res.data.exist === false && is) {
              callback(new Error('用户名不存在'))
            } else {
              callback()
            }
          })
      }, 500)
    }
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (!this.isLogin && this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
          callback()
        } else if (this.isLogin) {
          setTimeout(() => {
            this.$ajax
              .post('/data/checkUser', {
                userName: this.ruleForm.name,
                password: this.ruleForm.pass
              })
              .then((res) =>{
                if (res.data.exist === false) {
                  callback(new Error('用户名或密码错误'))
                } else {
                  this.ruleForm.userID = parseInt(res.data.userID)
                  this.ruleForm.email = res.data.email
                  callback()
                }
              })
          }, 500)
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
      isLogin: true, // true为登录，false为注册
      ruleForm: {
        pass: '',
        checkPass: '',
        name: '',
        email: '',
        userID: ''
      },
      rules: {
        pass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }],
        name: [{ validator: checkName, trigger: 'blur' }],
        email:[
          { required: false, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    //登录提交
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$message({
            showClose: true,
            message: '登录成功',
            type: 'success'
          });
          this.$store.commit('setUser',{name:this.ruleForm.name,ID:this.ruleForm.userID,email:this.ruleForm.email})
          this.$router.push('/')
        } else {
          this.$message({
            showClose: true,
            message: '无效登录信息',
            type: 'warning'
          });
          return false
        }
      })
    },
    //注册提交
    registerForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$ajax.post('/data/user/addUser', {
            userName: this.ruleForm.name,
            password: this.ruleForm.pass,
            email: this.ruleForm.email,
            userID: this.ruleForm.userID
          }).then((res)=> {
            if(res.data.succeed === false){
              this.$message({
                showClose: true,
                message: '注册失败，请重试',
                type: 'error'
              });
              return false
            }
            else{
              this.$message({
                showClose: true,
                message: '注册成功,前往登录',
                type: 'success'
              });
              this.isLogin=true;
              return true
            }
          })
        } else {
          this.$message({
            showClose: true,
            message: '无效注册信息',
            type: 'warning'
          })
          return false
        }
      })

    },
    changLogin () {
      this.$refs.ruleForm.validateField('name')
      this.isLogin = !this.isLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100%;
}
.login-page {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  margin: 180px auto;
  width: 400px;
  padding: 35px 35px 15px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
</style>
