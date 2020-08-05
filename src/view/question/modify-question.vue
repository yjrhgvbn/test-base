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
        当前位置：试题管理<i class="fa fa-fw fa-angle-right"></i>添加试题
      </div>
      <div class="main">
        <div class="tabList">
          <span class="active">SEO设置</span>
        </div>
        <div class="tabBody tactive">
          <div class="twoBox">
            <div class="leftbox">
              <div class="ios-form-group">
                <div class="ios-title">
                  <em class="ios-tip-must">*</em>
                  <span class="ios-tip-name">课程名：</span>
                </div>
                <div class="ios-select-box">
                  <select v-model="bank" class="ios-select">
                    <option v-for="item in this.$store.state.banks" :value="item">{{item}}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="rightbox">
              <div class="ios-form-group">
                <div class="ios-title">
                  <em class="ios-tip-must">*</em>
                  <span class="ios-tip-name">难易度：</span>
                </div>
                <div class="ios-select-box">
                  <select v-model="level" class="ios-select">
                    <option v-for="item in this.$store.state.levels" :value="item">{{item}}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="twoBox">
            <div class="leftbox">
              <div class="ios-form-group">
                <div class="ios-title">
                  <em class="ios-tip-must">*</em>
                  <span class="ios-tip-name">题目类型：</span>
                </div>
                <div class="ios-select-box">
                  <select v-model="type" class="ios-select">
                    <option v-for="item in this.$store.state.types" :value="item">{{item}}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="rightbox">
            </div>
          </div>

          <div class="ios-form-group mrb10">
            <div class="ios-title">
              <em class="ios-tip-must">*</em>
              <span class="ios-tip-name">题目</span>
            </div>
            <div class="ios-textarea-box">
              <textarea v-model="describe" class="ios-textarea">{{describe}}</textarea>
            </div>
          </div>

          <div class="ios-form-group mrb10">
            <div class="ios-title">
              <em class="ios-tip-must">*</em>
              <span class="ios-tip-name">答案</span>
            </div>
            <div class="ios-textarea-box">
              <textarea v-model="answer" class="ios-textarea">{{answer}}</textarea>
            </div>
          </div>

          <div class="ios-form-group">
            <div class="ios-title">
              <em class="ios-tip-must">*</em>
              <span class="ios-tip-name">图片：</span>
            </div>
            <div class="ios-upload-box">
              <el-upload
                action="aaa"
                :limit="1"
                ref="upload"
                :file-list="fileList"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-change="checkUpload"
                :http-request="upload"
                :auto-upload="false">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </div>
          </div>
        </div>
        <div>
          <span class="ios-button ios-button-blue ios-button-2x" @click="submitUpload">保存发布</span>
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
        type: '',
        describe: '',
        answer: '',
        bank: '',
        level: '',
        dialogImageUrl: '',
        dialogVisible: false,
        isFile: false,
        fileList: [],
        questionID: this.$route.params.id,
      }
    },
    methods: {
      submitUpload () {
        if (this.isFile) {
          this.$refs.upload.submit()
        } else {
          this.submitQuestion(null)
        }
      },
      upload (file) {
        console.log(file)
        if (!file) {
          return
        }
        const formData = new FormData()
        const isJPG = file.file.type === 'image/jpeg'
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG 格式!')
          return
        }
        const headerConfig = {headers: {'Content-Type': 'multipart/form-data'}}
        formData.append('file', file.file)
        this.$ajax.post('/data/question/upload', formData, headerConfig)
          .then((res) => {
            console.log(res)
            if (res.data.succeed === false) {
              this.$message.error('上传图片失败!')
            } else {
              this.submitQuestion(res.data.picture)
            }
          })
      },
      submitQuestion: function (picture) {
        this.$ajax.post('/data/question/modifyQuestion', {
          type: this.type,
          describe: this.describe,
          answer: this.answer,
          bank: this.bank,
          level: this.level,
          userID: this.$store.state.userID,
          questionID: this.questionID,
          picture: picture
        }).then((res) => {
          if (res.data.succeed === false) {
            this.$message.error(res.data.message)
          } else {
            this.$message.success('提交成功')
          }
        })
      },
      checkUpload (file, fileList) {
        if (!file && !fileList) {
          this.isFile = false
        } else {
          this.isFile = true
        }
      },
      handlePictureCardPreview (file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      newInit () {
        this.$ajax.post('/data/question/geQuestion', {
          questionID: parseInt(this.$route.params.id)
        }).then((res) => {
          if (res.data.succeed === false) {
            this.$message.error('数据获取失败')
          } else {
            this.type = res.data.question.Type
            this.describe = res.data.question.Describtion
            this.answer = res.data.question.Anser
            this.bank = res.data.question.Bank_name
            this.level = res.data.question.Question_level
            if (res.data.question.Picture != null) {
              this.isFile = true
              this.fileList.push(
                {
                  name: res.data.question.Picture + '.jpg',
                  url: '../../../static/upload/question/' + res.data.question.Picture + '.jpg'
                }
              )
            } else {
              this.isFile = false
            }
          }
        })

      }
    },
    mounted () {
      this.$ajax.post('/data/question/checkPower', {
        userID:this.$store.state.userID,
        questionID: parseInt(this.$route.params.id)
      }).then((res) => {
        console.log(res)
        if (res.data.succeed === false) {
          this.$router.go(-1)
          this.$message.error(res.data.message)
        }
      })
      this.newInit()
    },
    name: 'modify-question'

  }
</script>

<style scoped>
  @import "../../css/component.css";
  @import "../../css/admin.css";
  @import "../../css/font-awesome.min.css";
</style>
