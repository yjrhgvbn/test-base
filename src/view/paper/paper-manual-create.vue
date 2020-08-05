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
        当前位置：试卷管理<i class="fa fa-fw fa-angle-right"></i>手动生卷
      </div>
      <div class="main">
        <div class="tabList">
          <span class="active" @click="dialogVisible2 = true">下一步</span>
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
              <button @click="getQuestionList">搜索</button>
            </div>
          </div>
        </div>

        <div class="tableLists">
          <table>
            <colgroup>
              <col width="80">
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
              <th>
                <el-checkbox @change="getSelectQuestionList" label="已选" v-model="selected"></el-checkbox>
              </th>
              <th>编号</th>
              <th>题目</th>
              <th>答案</th>
              <th>类型</th>
              <th>难度</th>
              <th>科目</th>
              <th>来源</th>
            </tr>
            <tr v-for="question in this.questionList">
              <td>
                <label class="ios-checkbox-box-single height30px">
                  <input :value="question.Question_id" type="checkbox" v-model="selectQuestions"
                         class="ios-checkbox-single">
                  <span class="ios-checkbox-span-single"></span>
                </label>
              </td>
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
              <dic class="question-detail">{{selectQuestion.Anser}}</dic>
              <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
            </el-dialog>

            <el-dialog
              style="text-align:left;"
              title="请输入"
              :visible.sync="dialogVisible2"
              width="35%"
            >
              <el-input v-model="params.name" placeholder="请输入名字" style="width: 300px"></el-input>
              <el-select v-model="params.course" style="margin-top: 20px;" placeholder="请选择科目">
                <el-option v-for="item in this.$store.state.banks" :key="item" :label="item" :value="item"></el-option>
              </el-select>
              <el-select v-model="params.level" style="margin-top: 20px;" placeholder="请选择难度">
                <el-option v-for="item in this.$store.state.levels" :key="item" :label="item" :value="item"></el-option>
              </el-select>
              <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">返回</el-button>
              <el-button type="primary" @click="CreatePaper">确 定</el-button>
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
        selected:false,
        selectQuestions: [],
        questionList: [],
        questionCount: 17,
        currentPage: 1,
        dialogVisible: false,
        dialogVisible2: false,
        selectQuestion: '',
        sqlParams: {
          type: '',
          level: '',
          search: '',
          bank: '',
          page: 0
        },
        params: {
          paperID:'',
          name: '',
          level: '',
          course: '',
          fillList: [],
          selectList: [],
          stickList: [],
        },
      }
    },
    methods: {
      getSelectQuestionList (val) {
        if(val){
          this.$ajax.post('/data/paper/questionSelectList', {selectIDs: this.selectQuestions})
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
        }else{
          this.getQuestionList()
        }
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
      CreatePaper () {
        this.$ajax.post('/data/paper/questionSelectList', {selectIDs: this.selectQuestions})
          .then(res => {
            if (res.data.succeed === true) {
              let list = res.data.list
              for(let que of list){
                if(que.Type===this.$store.state.types[0])
                  this.params.fillList.push(que)
                else if(que.Type===this.$store.state.types[1])
                  this.params.selectList.push(que)
                else
                  this.params.stickList.push(que)
              }
              this.$router.push({
                path: '/paper/modifyDetail',
                query: {
                  id: this.params
                }
              })
            } else {
              this.$message({
                showClose: true,
                message: '生成失败，请重试',
                type: 'error'
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
      this.$ajax.post('/data/checkModifyPower', {
        userID: this.$store.state.userID
      }).then((res) => {
        if (res.data.succeed === false) {
          this.$message.error(res.data.message)
          this.$router.go(-1)
        }
      })
      if(this.$route.query.id && ("paperID" in this.$route.query.id))
      {
        this.params.paperID=this.$route.query.id.paperID
        this.$ajax.post('/data/paper/getPaper', {paperID:this.params.paperID})
          .then(res => {
            console.log(res)
            if (res.data.succeed === true) {
              this.selectQuestions = res.data.paperQuestionList.map(a=>a.Question_id)
              this.params.name = res.data.paper.Paper_name
              this.params.course = res.data.paper.Course
              this.params.level = res.data.paper.Paper_level
              if(this.selectQuestions.length<=0)
                return
              this.selected=true
              this.getSelectQuestionList(true)
            }else{
              this.$message({
                showClose: true,
                message: '获取试卷数据失败',
                type: 'error'
              })
            }
          })
      }
      this.getQuestionList(this.sqlParams)
    },
    name: 'paper-manual-create'
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
