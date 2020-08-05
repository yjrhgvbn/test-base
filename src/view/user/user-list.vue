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
              <select v-model="sqlParams.power">
                <option value="">全部权限</option>
                <option v-for="item in powers" :value="item">{{item}}</option>
              </select>
              <input type="text" placeholder="请输入" v-model="sqlParams.search">
              <button @click="Search">搜索</button>
            </div>
          </div>
        </div>

        <div class="tableLists">
          <table>
            <colgroup>
              <col width="150">
              <col>
              <col width="200">
              <col width="150">
              <col width="150">
              <col width="150">
            </colgroup>
            <tr>
              <th>用户ID</th>
              <th>用户名</th>
              <th>邮箱</th>
              <th>权限</th>
              <th>权限修改</th>
              <th>删除</th>
            </tr>
            <tr v-for="(user, index) in this.userList">
              <td>{{user.User_id}}</td>
              <td>{{user.User_name}}</td>
              <td>{{user.Email}}</td>
              <td>{{oldPower[index]}}</td>
              <td>
                <select @change="modifyPower(user,oldPower[index])" v-model="user.Power">
                  <option v-for="item in powers">{{item}}</option>
                </select>
              </td>
              <td>
                <a style="cursor:pointer" @click="tryDelete(user)" class="ios-del-btn">删除</a>
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
              :total="this.userCount">
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
        userList: [],
        userCount: 17,
        currentPage: 1,
        selectUser: '',
        powers: this.$store.state.powers,
        oldPower: [],
        sqlParams: {
          power: '',
          search: '',
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
      getUserList () {
        this.$ajax.post('/data/user/userList', this.sqlParams)
          .then(res => {
            if (res.data.succeed === true) {
              this.userList = res.data.list
              this.oldPower = res.data.list.map(a => a.Power)
              this.userCount = res.data.count
            } else {
              this.$message({
                showClose: true,
                message: '无法获取用户列表',
                type: 'error'
              })
            }
          })
      },
      checkPower (user) {
        this.$ajax.post('/data/user/checkAdmin', {
          userID: this.$store.state.userID
        }).then((res) => {
          if (res.data.succeed === false) {
            this.$message.error(res.data.message)
          } else {
            this.$router.push('/user/modify/' + user.User_id)
          }
        })
      },
      tryDelete (user) {
        this.$ajax.post('/data/user/checkAdmin', {
          userID: this.$store.state.userID
        }).then((res) => {
          if (res.data.succeed === false) {
            this.$message.error(res.data.message)
          } else {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$ajax.post('/data/user/deleteUser', {
                userID: user.User_id
              }).then((res) => {
                if (res.data.succeed === false) {
                  this.$message.error(res.data.message)
                } else {
                  this.$message.success('删除成功')
                  this.getUserList(this.sqlParams)
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
      modifyPower (user, power) {
        this.$confirm('是否修改用户权限?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$ajax.post('/data/user/modifyUserPower', {
            power: user.Power,
            userID: user.User_id
          }).then((res) => {
            if (res.data.succeed === false) {
              this.$message.error(res.data.message)
            } else {
              this.$message.success('修改成功')
              this.getUserList(this.sqlParams)
            }
          })
        }).catch(() => {
          user.Power = power
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.sqlParams.page = val - 1
        this.getUserList(this.sqlParams)
      },
    },
    mounted () {
      this.$ajax.post('/data/user/checkAdmin', {
        userID: this.$store.state.userID
      }).then((res) => {
        if (res.data.succeed === false) {
          this.$message.error(res.data.message)
          this.$router.go(-1)
        } else {
          this.getUserList(this.sqlParams)
        }
      })
    },
    name: 'user-list'
  }
</script>

<style scoped>
  @import "../../css/component.css";
  @import "../../css/admin.css";
  @import "../../css/font-awesome.min.css";
</style>
