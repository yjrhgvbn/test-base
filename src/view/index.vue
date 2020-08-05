<template>
  <div>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
    </head>

    <body style="margin:0px">
    <div class="admin">
      <div class="top">
        <div class="left">
          2020CMS
        </div>
        <div class="right">
          <a @click="dialogVisible = true" style="cursor: pointer">
            <i class="fa fa-cog"></i>
            <span>注销账户</span>
          </a>
          <a @click="modifyVisible =! modifyVisible" style="cursor: pointer">
            <i class="fa fa-cog"></i>
            <span >用户信息修改</span>
          </a>
          <a @click="Logout">
            <i class="fa fa-fw fa-power-off"></i>
            <span>退出登录</span>
          </a>
        </div>
      </div>
      <div class="body">
        <div class="left">
          <div class="menu">
            <div class="title" :class="{ontitle:selected===0}" @click="selected=0">
              <i class="fa fa-fw fa-navicon"></i> 试题管理 <i class="fa fa-fw fa-angle-right"></i>
            </div>
            <ul class="downmenu">
              <li :class="{onLink:this.$route.path==='/'}"><a href="#/">试题列表</a></li>
              <li :class="{onLink:this.$route.path==='/question/add'}"><a href="#/question/add">创建试题</a></li>
            </ul>
          </div>
          <!-- 分割线 -->
          <div class="menu">
            <div class="title" :class="{ontitle:selected===1}" @click="selected=1">
              <i class="fa fa-fw fa-file-powerpoint-o"></i> 试卷管理 <i class="fa fa-fw fa-angle-right"></i>
            </div>
            <ul class="downmenu">
              <li :class="{onLink:this.$route.path==='/paper/list'}"><a href="#/paper/list" >试卷列表</a></li>
              <li :class="{onLink:this.$route.path==='/paper/auto'}"><a href="#/paper/auto">自动生卷</a></li>
              <li :class="{onLink:this.$route.path==='/paper/message'}"><a href="#/paper/message">手动生卷</a></li>
            </ul>
          </div>
          <!-- 分割线 -->
          <div class="menu">
            <div class="title" :class="{ontitle:selected===2}" @click="selected=2">
              <i class="fa fa-fw fa-user"></i> 用户管理 <i class="fa fa-fw fa-angle-right"></i>
            </div>
            <ul class="downmenu">
              <li :class="{onLink:this.$route.path==='/user/list'}"><a href="#/user/list">用户列表</a></li>
            </ul>
          </div>

        </div>
        <!-- 分割线 -->
        <div class="right">
          <div id="rightiframe">
            <user v-if="modifyVisible" @sendParent="SetVisible"></user>
            <router-view v-else></router-view>
          </div>
        </div>
      </div>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        >
        <span>确认注销账户</span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="DeleteUser">确 定</el-button>
  </span>
      </el-dialog>

    </div>
    </body>

  </div>

</template>

<script>
  import user from './user/user-modify'

  export default {
    components: {
      user
    },
    data () {
      return {
        modifyVisible: false,
        selected:0,
        selectedLink:0,
        dialogVisible: false
      }
    },
    methods: {
      Logout(){
        this.$store.commit('initUser','')
        this.$router.push('/login')
      },
      DeleteUser(){
        this.$ajax.post('/data/user/deleteUser', {
          userID: this.$store.state.userID
        }).then((res) => {
          if (res.data.succeed === false) {
            this.$message.error(res.data.message)
          } else {
            this.$message.success('删除成功')
            this.Logout()
          }
        })
      },
      SetVisible: function () {
        this.modifyVisible = false
      },
      init () {
        this.$ajax.post('/data/bank/getBank').then((res) => {
          if (res.data.succeed === false) {
            this.$message.error('无法获取数据信息')
          } else {
            this.$store.commit('setBanks', res.data.banks)
          }
        })
      },
    },
    mounted () {
      if (this.$store.state.username === '') {
        this.$message({
          message: '请先登录',
          type: 'warning'
        })
        this.$router.push('/login')
      }
      this.init()
    },
    name: 'index'
  }
</script>

<style scoped>
  @import "../css/component.css";
  @import "../css/admin.css";
  @import "../css/font-awesome.min.css";
</style>
