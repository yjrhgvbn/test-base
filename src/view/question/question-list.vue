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
        当前位置：后台<i class="fa fa-fw fa-angle-right"></i>文档列表
      </div>
      <div class="main">
        <div class="tabList">
          <span class="active">文档列表</span>

          <div class="search_form">
            <div class="search_box">
              <select v-model="sqlParams.bank">
                <option value="">全部科目</option>
                <option v-for="item in this.$store.state.banks" :value="item">{{item}}</option>
              </select>
              <select v-model="sqlParams.level">
                <option value="">全部难度</option>
                <option v-for="item in this.$store.state.levels" :value="item">{{item}}</option>
              </select>
              <select v-model="sqlParams.type">
                <option value="">全部类型</option>
                <option v-for="item in this.$store.state.types" :value="item">{{item}}</option>
              </select>
              <input type="text" placeholder="请输入" v-model="sqlParams.search">
              <button @click="Search">搜索</button>
            </div>
          </div>
        </div>

        <div class="tableLists">
          <table>
            <colgroup>
              <col width="50">
              <col>
              <col width="100">
              <col width="90">
              <col width="90">
              <col width="125">
              <col width="90">
              <col width="125">
            </colgroup>
            <tr>
              <th>编号</th>
              <th>题目</th>
              <th>答案</th>
              <th>类型</th>
              <th>难度</th>
              <th>科目</th>
              <th>来源</th>
              <th>操作</th>
            </tr>
            <tr v-for="question in this.questionList">
              <td>{{question.Question_id}}</td>
              <td @click="dialogVisible = true,selectQuestion=question">
                <a class="ios-article-title">
                  <p>{{question.Describtion}}</p>
                </a>
              </td>
              <td @click="dialogVisible = true,selectQuestion=question">
                <a class="ios-article-title">
                  <p>{{question.Anser}}</p>
                </a>
              </td>
              <td>{{question.Type}}</td>
              <td>{{question.Question_level}}</td>
              <td>{{question.Bank_name}}</td>
              <td v-if="question.User_id">{{question.User_id}}</td>
              <td v-else style="color: darkred">(用户已注销)</td>
              <td>
                <a style="cursor:pointer" @click="checkPower(question)" class="ios-edit-btn">编辑</a>
                <a style="cursor:pointer" @click="tryDelete(question)" class="ios-del-btn">删除</a>
              </td>
            </tr>

            <el-dialog
              title="详细"
              :visible.sync="dialogVisible"
              width="45%"
              style="text-align:left"
            >
              <span class="question-detail">{{selectQuestion.Describtion}}</span>
              <div v-if="selectQuestion.Picture!=null" class="block question-detail">
                <el-image :src="'../../../static/upload/question/'+selectQuestion.Picture+'.jpg'"></el-image>
              </div>
              <el-divider></el-divider>
              <div class="question-detail">{{selectQuestion.Anser}}</div>
              <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
            </el-dialog>

          </table>
          <div class="block" style="padding-top: 15px">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-size="17"
              layout="prev, pager, next, jumper"
              :hide-on-single-page="true"
              :total="this.questionCount">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>

    </body>

  </div>
</template>

<script>
  export default {
    data () {
      return {
        questionList: [],
        questionCount: 17,
        currentPage: 1,
        dialogVisible: false,
        selectQuestion: '',
        sqlParams: {
          type: '',
          level: '',
          search: '',
          bank: '',
          page: 0
        },

      }
    },
    methods: {
      Search(){
        this.currentPage=1
        this.sqlParams.page=0
        this.getQuestionList()
      },
      getQuestionList () {
        this.$ajax.post('/data/question/questionList', this.sqlParams)
          .then(res => {
            if (res.data.succeed === true) {
              this.questionList = res.data.list
              this.questionCount = res.data.count
            } else {
              this.$message({
                showClose: true,
                message: '无法获取问题列表',
                type: 'error'
              })
            }
          })
      },
      checkPower (question) {
        this.$ajax.post('/data/question/checkPower', {
          userID: this.$store.state.userID,
          questionID: question.Question_id
        }).then((res) => {
          if (res.data.succeed === false) {
            this.$message.error(res.data.message)
          } else {
            this.$router.push('/question/modify/' + question.Question_id)
          }
        })
      },
      tryDelete (question) {
        this.$ajax.post('/data/question/checkPower', {
          userID: this.$store.state.userID,
          questionID: question.Question_id
        }).then((res) => {
          if (res.data.succeed === false) {
            this.$message.error(res.data.message)
          } else {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$ajax.post('/data/question/deleteQuestion', {
                questionID: question.Question_id
              }).then((res) => {
                if (res.data.succeed === false) {
                  this.$message.error(res.data.message)
                } else {
                  this.$message.success('删除成功')
                  this.getQuestionList(this.sqlParams)
                }
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
          }
        })
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.sqlParams.page = val - 1
        this.getQuestionList(this.sqlParams)
      },
    },
    mounted () {
      this.getQuestionList(this.sqlParams)
    },
    name: 'question-list'
  }
</script>

<style scoped>
  @import "../../css/component.css";
  @import "../../css/admin.css";
  @import "../../css/font-awesome.min.css";

  .question-detail {
    display: inline-block;
    margin: 10px 10px 10px 20px;
    line-height: 20px;
    child-align: left;
  }
</style>
