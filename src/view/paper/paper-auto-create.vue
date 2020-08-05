<template>
  <div>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
    </head>

    <body>
    <div class="rbody" id="app">
      <div class="top">
        当前位置：试卷管理<i class="fa fa-fw fa-angle-right"></i>自动生卷
      </div>
      <div class="main">
        <div class="tabList">
          <span class="active">试卷信息</span>
        </div>
        <div class="tabBody tactive">

          <div class="ios-form-group mrb10">
            <div class="ios-title">
              <em class="ios-tip-must">*</em>
              <span class="ios-tip-name">试卷名：</span>
            </div>
            <div class="ios-input-box">
              <input v-model="params.name" type="text" class="ios-input" placeholder="请输入">
            </div>
          </div>

          <div class="ios-form-group">
            <div class="ios-title">
              <em class="ios-tip-must">*</em>
              <span class="ios-tip-name">试卷类型：</span>
            </div>
            <div class="ios-select-box">
              <select v-model="params.course" class="ios-select">
                <option v-for="item in this.$store.state.banks" :value="item">{{item}}</option>
              </select>
            </div>
          </div>
          <div class="ios-form-group">
            <div class="ios-title">
              <em class="ios-tip-must">*</em>
              <span class="ios-tip-name">题目难度：</span>
            </div>
            <div class="ios-select-box">
              <select v-model="params.level" class="ios-select">
                <option v-for="item in this.$store.state.levels" :value="item">{{item}}</option>
              </select>
            </div>
          </div>

          <div class="twoBox">
            <div class="leftbox">
              <div class="ios-form-group mrb10">
                <div class="ios-title">
                  <em class="ios-tip-must">*</em>
                  <span class="ios-tip-name">填空题数量：</span>
                </div>
                <div class="ios-input-box">
                  <input v-model="params.fillNum" type="text" class="ios-input" placeholder="请输入">
                </div>
              </div>
            </div>
            <div class="rightbox">
              <div class="ios-form-group mrb10">
                <div class="ios-title">
                  <em class="ios-tip-must">*</em>
                  <span class="ios-tip-name">选择题数量：</span>
                </div>
                <div class="ios-input-box">
                  <input v-model="params.selectNum" type="text" class="ios-input" placeholder="请输入">
                </div>
              </div>
            </div>
          </div>
          <div class="twoBox">
            <div class="leftbox">
              <div class="ios-form-group mrb10">
                <div class="ios-title">
                  <em class="ios-tip-must">*</em>
                  <span class="ios-tip-name">简单题数量：</span>
                </div>
                <div class="ios-input-box">
                  <input v-model="params.stickNum" type="text" class="ios-input" placeholder="请输入">
                </div>
              </div>
            </div>
            <div class="rightbox">
            </div>
          </div>
        </div>
        <div>
          <span class="ios-button ios-button-blue ios-button-2x" @click="CreatePaper">试卷生成</span>
        </div>
      </div>
    </div>
    </body>
  </div>
</template>

<script>
  export default {
    //let sqlParams = ['填空题',req.body.fillNum,'选择题',req.body.selectNum,'简答题',req.body.stickNum]
    data () {
      return {
        params:{
          name:'',
          level: '',
          course:'',
          fillNum:'',
          selectNum:'',
          stickNum:'',
        },

      }
    },
    methods: {
      CreatePaper(){
        console.log( this.params)
        this.$router.push({
          path: '/paper/modifyDetail',
          query: {
            id: this.params
          }
        })
      },
      Init () {
      }
    },
    mounted () {
      this.$ajax.post('/data/checkModifyPower', {
        userID: this.$store.state.userID
      }).then((res) => {
        if (res.data.succeed === false) {
          this.$message.error(res.data.message)
          this.$router.go(-1)
        } else {
          this.Init()
        }
      })
    },
    name: 'paper-auto-create'
  }
</script>

<style scoped>
  @import "../../css/component.css";
  @import "../../css/admin.css";
  @import "../../css/font-awesome.min.css";
</style>
