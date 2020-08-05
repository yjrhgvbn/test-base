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
        当前位置：后台<i class="el-icon-caret-right"></i>链接列表
      </div>
      <div class="main">
        <div class="tabList">
          <span class="active">试卷列表</span>

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
              <input type="text" placeholder="请输入" v-model="sqlParams.search">
              <button @click="Search">搜索</button>
            </div>
          </div>
        </div>

        <div class="tableLists">
          <table>
            <colgroup>
              <col width="60">
              <col width="50">
              <col>
              <col width="200">
              <col width="90">
              <col width="150">
              <col width="100">
              <col width="125">
            </colgroup>
            <tr>
              <th>查看</th>
              <th>编号</th>
              <th>试卷名称</th>
              <th>试卷课程</th>
              <th>难度</th>
              <th>添加时间</th>
              <th>来源</th>
              <th>操作</th>
            </tr>
            <tr v-for="paper in this.paperList">
              <td>
                <el-button size="mini" icon="el-icon-search" circle type="info" @click="GoDetail(paper)"></el-button>
              </td>
              <td>{{paper.Paper_id}}</td>
              <td>
                <a class="ios-article-title">
                  <p>{{paper.Paper_name}}</p>
                </a>
              </td>
              <td>{{paper.Course}}</td>
              <td>{{paper.Paper_level}}</td>
              <td>{{paper.Date}}</td>
              <td  v-if="paper.User_id">{{paper.User_id}}</td>
              <td v-else style="color: darkred">(用户已注销)</td>
              <td>
                <a style="cursor:pointer" @click="checkPower(paper)" class="ios-edit-btn">编辑</a>
                <a style="cursor:pointer" @click="tryDelete(paper)" class="ios-del-btn">删除</a>
              </td>
            </tr>
          </table>
          <div class="block" style="padding-top: 15px">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-size="17"
              layout="prev, pager, next, jumper"
              :hide-on-single-page="true"
              :total="this.paperCount">
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
        paperList: [],
        paperCount: 17,
        currentPage: 1,
        sqlParams: {
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
      getPaperList () {
        this.$ajax.post('/data/paper/paperList', this.sqlParams)
          .then(res => {
            if (res.data.succeed === true) {
              this.paperList = res.data.list;
              this.paperCount = res.data.count
            } else {
              this.$message({
                showClose: true,
                message: '无法获取试卷列表',
                type: 'error'
              })
            }
          })
      },
      GoDetail(paper){
        this.$router.push({
          path: '/paper/detail',
          query: {
            id: {
              name:paper.Paper_name,
              course:paper.Course,
              paperID:paper.Paper_id
            }
          }
        })
      },
      checkPower (paper) {
        this.$ajax.post('/data/paper/checkPower', {
          userID: this.$store.state.userID,
          paperID: paper.Paper_id
        }).then((res) => {
          if (res.data.succeed === false) {
            this.$message.error(res.data.message)
          } else {
            this.$router.push({
              path: '/paper/message',
              query: {
                id: {paperID:paper.Paper_id}
              }
            })
          }
        })
      },
      tryDelete (paper) {
        this.$ajax.post('/data/paper/checkPower', {
          userID: this.$store.state.userID,
          paperID: paper.Paper_id
        }).then((res) => {
          if (res.data.succeed === false) {
            this.$message.error(res.data.message)
          } else {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$ajax.post('/data/paper/deletePaper', {
                paperID: paper.Paper_id
              }).then((res) => {
                if (res.data.succeed === false) {
                  this.$message.error(res.data.message)
                } else {
                  this.$message.success('删除成功')
                  this.getPaperList(this.sqlParams)
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
        this.getPaperList(this.sqlParams)
      },
    },
    mounted () {
      this.getPaperList(this.sqlParams)
    },
    name: 'paper-list'
  }
</script>

<style scoped>
  @import "../../css/component.css";
  @import "../../css/admin.css";
  @import "../../css/font-awesome.min.css";
</style>
