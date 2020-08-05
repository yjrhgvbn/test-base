<template>
  <div>
    <head>
      <meta charset="UTF-8">
    </head>
    <body>
    <header>
      <div style="margin-top: 20px">
        <el-button @click="GoBack" style="width: 100px;margin-left: 5%">返回</el-button>
      </div>
      <el-divider></el-divider>
      <h1 align="center">{{paper.name}}</h1>
      <table class="frame space " width="100%">
        <tr>
          <th width="30%">考试科目：{{paper.course}}</th>
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
        <div class="frame space">
          <h4>一·填空题</h4>
          <div class="interval">
            <div v-for="(item,i) in fillList">
              <p v-if="item.Describtion===null" style="color: red">{{i+1}}.题目缺失</p>
              <p v-else>{{i+1}}.{{item.Describtion}}</p>
            </div>
          </div>
        </div>
        <div class="frame space">
          <h4>二·选择题</h4>
          <div class="interval">
            <div v-for="(item,i) in selectList">
              <p v-if="item.Describtion===null" style="color: red">{{i+1}}.题目缺失</p>
              <p v-else>{{i+1}}.{{item.Describtion}}</p>
            </div>
          </div>
        </div>
        <div class="frame space">
          <h4>三·简 答 题 </h4>
          <div v-for="(item,i) in stickList" class="interval">
            <p v-if="item.Describtion===null" style="color: red">{{i+1}}.题目缺失</p>
            <div v-else>
              {{i+1}}.{{item.Describtion}}<br/>
              <div v-if="item.Picture!=null" class="block question-detail">
                <el-image :src="'../../../static/upload/question/'+item.Picture+'.jpg'"></el-image>
              </div>
              <textarea rows="5" cols="80%"></textarea>
            </div>
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
        paper: {}
      }
    },
    methods: {
      GoBack () {
        this.$router.go(-1)
      },
      GoModify () {
        this.$ajax.post('/data/paper/checkPower', {
          userID: this.$store.state.userID,
          paperID: this.paper.paperID
        })
          .then((res) => {
            if (res.data.succeed === false) {
              this.$message.error(res.data.message)
            } else {
              this.$router.push({
                path: '/paper/message',
                query: {
                  id: {paperID: this.paper.paperID}
                }
              })
            }
          })
      },
    },
    mounted () {
      this.paper = this.$route.query.id
      this.$ajax.post('/data/paper/getPaperQuestion', {
        paperID: this.paper.paperID
      }).then(res => {
        console.log(res)
        if (res.data.succeed === true) {
          let list = res.data.list
          for (let que of list) {
            if (que.Type === this.$store.state.types[0]) {
              this.fillList.push(que)
            } else if (que.Type === this.$store.state.types[1]) {
              this.selectList.push(que)
            } else {
              this.stickList.push(que)
            }
          }
        } else {
          this.$message({
            showClose: true,
            message: '读取试卷失败',
            type: 'error'
          })
        }
      })
    },
    name: 'paper-detail'
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
