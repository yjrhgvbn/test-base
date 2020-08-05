<template>
  <div>
    <head>
      <meta charset="UTF-8">
    </head>
    <body>
    <header>
      <div style="margin-top: 20px">
        <el-button @click="GoBack" style="width: 100px;margin-left: 5%">返回</el-button>
        <el-button v-if="this.params.paperID!==''" @click="SavePaper" style="width: 100px;margin-left: 67%">确认修改</el-button>
        <el-button v-else @click="SavePaper" style="width: 100px;margin-left: 67%">保存</el-button>
      </div>
      <el-divider></el-divider>
      <h1 align="center">{{params.name}}</h1>
      <table class="frame space " width="100%">
        <tr>
          <th width="30%">考试科目：{{params.course}}</th>
          <th width="30%">时间：100分钟</th>
          <th width="40%">得分：</th>
        </tr>
      </table>
      <table class="frame space" width="100%">
        <tr>
          <th width="30%">班级：<input type="text"></th>
          <th width="30%">学号：<input type="text"></th>
          <th width="40%">姓名：<input type="text"></th>
        </tr>
      </table>
    </header>
    <article>
      <form>
        <div v-if="fillList.length>0" class="frame space">
          <h4>一·填空题</h4>
          <div class="interval">
            <p v-for="(item,i) in fillList">{{i+1}}.{{item.Describtion}}
            </p>
          </div>
        </div>
        <div v-if="selectList.length>0" class="frame space">
          <h4>二·选择题</h4>
          <div class="interval">
            <p v-for="(item,i) in selectList">{{i+1}}.{{item.Describtion}}
            </p>
            </div>
          </div>
          <div v-if="stickList.length>0" class="frame space">
          <h4>三·简 答 题 </h4>
          <div v-for="(item,i) in stickList" class="interval">
            {{i+1}}.{{item.Describtion}}<br/>
            <div v-if="item.Picture!=null" class="block question-detail">
              <el-image :src="'../../../static/upload/question/'+item.Picture+'.jpg'"></el-image>
            </div>
            <textarea rows="5" cols="80%"></textarea>
          </div>
        </div>
      </form>
    </article>
    </body>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        fillList: [],
        selectList: [],
        stickList: [],
        params: {}
      }
    },
    methods: {
      GoBack(){
        this.$router.go(-1)
      },
      SavePaper(){
        if(("paperID" in this.params) && this.params.paperID!=='')
        {
          this.$ajax.post('/data/paper/modifyPaper', {
            paperID:this.params.paperID,
            questionIDs: this.fillList.map(a => a.Question_id).concat(
              this.selectList.map(a => a.Question_id), this.stickList.map(a => a.Question_id))
          })
            .then(res => {
              if (res.data.succeed === true) {
                this.$message({
                  showClose: true,
                  message: '修改成功',
                  type: 'success'
                })
              } else {
                this.$message({
                  showClose: true,
                  message: '修改失败',
                  type: 'error'
                })
              }
            })
        }else {
          this.$ajax.post('/data/paper/addPaper', {
            paperName: this.params.name,
            course: this.params.course,
            userID: this.$store.state.userID,
            level: this.params.level,
            questionIDs: this.fillList.map(a => a.Question_id).concat(
              this.selectList.map(a => a.Question_id), this.stickList.map(a => a.Question_id))
          })
            .then(res => {
              if (res.data.succeed === true) {
                this.$message({
                  showClose: true,
                  message: '保存成功',
                  type: 'success'
                })
              } else {
                this.$message({
                  showClose: true,
                  message: '保存失败',
                  type: 'error'
                })
              }
            })
        }
      },
    },
    mounted () {
      console.log(this.$route.query.id,"asdasd")
      this.params = this.$route.query.id
      if (("fillList" in this.params) || ("selectList" in this.params) || ("stickList" in this.params)) {
        this.fillList = this.params.fillList
        this.selectList = this.params.selectList
        this.stickList = this.params.stickList
      } else {
        this.$ajax.post('/data/paper/randPaper', {
          fillNum: this.params.fillNum||0,
          selectNum: this.params.fillNum||0,
          stickNum: this.params.fillNum||0,
        })
          .then(res => {
            if (res.data.succeed === true) {
              this.fillList = res.data.fill
              this.selectList = res.data.select
              this.stickList = res.data.stick
            } else {
              this.$message({
                showClose: true,
                message: '保存失败',
                type: 'error'
              })
              this.$router.go(-1)
            }
          })
      }

    },
    name: 'paper-modify-detail'
  }
</script>

<style scoped>
  body {
    margin-left: 200px;
    margin-right: 200px;
    text-align: left;
  }

  .frame {
    border: 1px solid black;
  }

  .space {
    margin-top: 20px;
  }

  .table {
    height: 40px;
  }

  .h4 {
    background-color: gainsboro;
    line-height: 48px;
    margin: 0px auto;
  }

  .interval {
    margin-left: 20px;
    margin-top: 30px;
    margin-bottom: 10px;
  }

  .button {
    background-color: aqua;
    height: 30px;
    width: 100px;
    font-size: 14px;
  }
  .question-detail {
    max-width: 400px;
    display: inline-block;
    line-height: 20px;
    child-align: left;
  }
</style>
