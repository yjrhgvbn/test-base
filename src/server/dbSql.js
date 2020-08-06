const sqlCommand = require('../server/sqlCommand')
const express = require('express')
const router = express.Router()
const query = require('./db')
const multer = require('multer')
function dir(destination) {
  var upload = multer({
    storage: multer.diskStorage({
      destination: destination,
      filename: function (req, file, cb) {
        cb(null,  file.originalname);
      }
    })
  })
  return upload
}
router.use('/question/upload', dir("../../static/upload/question").single('file'), function (req, res) {
  if (req.file){
    res.json({
      succeed: true,
      picture:req.file.originalname.substring(0,req.file.originalname.length-4)
    });
    res.end();
  }
})

router.use('/checkUser', function (req, res) {
  let sql
  let sqlParams
  if (!req.body.password) {
    sql = sqlCommand.selectUser
    sqlParams = [req.body.userName]
  } else {
    sql = sqlCommand.selectUserAndPassword
    sqlParams = [req.body.userName, req.body.password]
  }
  query(sql, sqlParams, function (err, result) {
    if (err || result.length === 0) {
      res.json({
        exist: false
      })
    } else {
      res.json({
        exist: true,
        userID: result[0].User_id,
        email:result[0].Email,
      })
    }
    res.end()
  })
})

router.use('/user/addUser', function (req, res) {
  let sql = sqlCommand.insertUser;
  let sqlParams = [req.body.userName, req.body.userID, req.body.password, req.body.email]
  query(sql, sqlParams, function (err, result){
    if(err){
      res.json({
        succeed: false
      })
    }
    else{
      res.json({
        succeed: true
      })
    }
    res.end()
  })
})

router.use('/user/deleteUser', function (req, res) {
  let sql = sqlCommand.deleteUser;
  let sqlParams = [req.body.userID]
  query(sql, sqlParams, function (err, result){
    if(err){
      res.json({
        succeed: false,
        message: '删除失败'
      })
    } else{
      res.json({
        succeed: true
      })
    }
    res.end()
  })
})

router.use('/user/checkAdmin', function (req, res) {
  let sql = sqlCommand.checkAdmin;
  let sqlParams = [req.body.userID]
  query(sql, sqlParams, function (err, result){
    if(err){
      res.json({
        succeed: false,
        message: '数据请求失败'
      })
    } else if(result.length === 0){
      res.json({
        succeed: false,
        message: '你不是系统管理员'
      })
    }else{
      res.json({
        succeed: true
      })
    }
    res.end()
  })
})

router.use('/user/modifyUserPower', function (req, res) {
  let sql = sqlCommand.checkModifyPower;
  let sqlParams = [req.body.userID]
  query(sql, sqlParams, function (err, result){
    if(err){
      res.json({
        succeed: false,
        message: "修改失败"
      })
    }
    else{
      res.json({
        succeed: true
      })
    }
    res.end()
  })
})

router.use('/user/userModify', function (req, res) {
  let sql = sqlCommand.updateUser;
  let sqlParams = [req.body.name,req.body.password, req.body.email,req.body.userID,req.body.oldPass]
  query(sql, sqlParams, function (err, result){
    if(err){
      res.json({
        succeed: false,
        message: "密码错误"
      })
    }else if(result.affectedRows === 0){
      res.json({
        succeed: false,
        message: "无法修改"
      })
    }
    else{
      res.json({
        succeed: true
      })
    }
    res.end()
  })
})

router.use('/checkModifyPower', function (req, res) {
  let sql = sqlCommand.checkModifyPower
  let sqlParams = [req.body.userID]
  query(sql, sqlParams, function (err, result){
    if(err){
      res.json({
        succeed: false,
        message: '无法查询权限'
      })
    }else if(result.length === 0){
      res.json({
        succeed: false,
        message: '权限不足'
      })
    }else{
      res.json({
        succeed: true
      })
    }
    res.end()
  })
})

router.use('/user/userList', function (req, res) {
  let isHaveWhere = false
  let sql='SELECT SQL_CALC_FOUND_ROWS * FROM user '
  let sqlParams = []
  if(req.body.search!==''){
    sql += 'WHERE User_name LIKE ? '
    isHaveWhere = true
    sqlParams.push("%"+req.body.search+"%")
  }
  if(req.body.power!==''){
    if(!isHaveWhere){
      sql+='WHERE '
    }else{
      sql+='AND '
    }
    sql+='Power=? '
    sqlParams.push(req.body.power)
  }
  //12一页
  sql+='LIMIT ? , ? ;SELECT FOUND_ROWS() as count;'
  let page = parseInt(req.body.page);
  sqlParams.push(page*17)
  sqlParams.push(17)
  query(sql, sqlParams, function (err, result){
    if(err){
      res.json({
        succeed: false
      })
    }
    else{
      res.json({
        list:result[0],
        succeed: true,
        count:result[1][0].count
      })
    }
    res.end()
  })
})


router.use('/question/addQuestion', function (req, res) {
  let sql = sqlCommand.insertQuestion;
  let sqlParams = [req.body.type, req.body.describe,req.body.answer, req.body.bank,
    req.body.level,req.body.userID,req.body.picture,req.body.userID]
  query(sql, sqlParams, function (err, result){
    if(err){
      res.json({
        succeed: false,
        message: "提交失败"
      })
    }
    else if(result.affectedRows === 0){
      res.json({
        succeed: false,
        message: "你的权限不足"
      })
    }
    else{
      res.json({
        succeed: true
      })
    }
    res.end()
  })
})

router.use('/question/modifyQuestion', function (req, res) {
  let sql = sqlCommand.updateQuestion;
  let sqlParams = [req.body.type, req.body.describe,req.body.answer, req.body.bank,
    req.body.level,req.body.userID,req.body.picture,req.body.questionID]
  query(sql, sqlParams, function (err, result){
    if(err){
      res.json({
        succeed: false,
        message: "提交失败"
      })
    }
    else{
      res.json({
        succeed: true
      })
    }
    res.end()
  })
})

router.use('/question/questionList', function (req, res) {
  let isHaveWhere = false
  let sql='SELECT SQL_CALC_FOUND_ROWS * FROM question '
  let sqlParams = []
  if(req.body.search!==''){
    sql += 'WHERE Describtion LIKE ? '
    isHaveWhere = true
    sqlParams.push("%"+req.body.search+"%")
  }
  if(req.body.bank!==''){
    if(!isHaveWhere){
      sql+='WHERE '
      isHaveWhere=true
    }else{
      sql+='AND '
    }
    sql+='Bank_name=? '
    sqlParams.push(req.body.bank)
  }
  if(req.body.level!==''){
    if(!isHaveWhere){
      sql+='WHERE '
      isHaveWhere=true
    }else{
      sql+='AND '
    }
    sql+='Question_level=? '
    sqlParams.push(req.body.level)
  }
  if(req.body.type!==''){
    if(!isHaveWhere){
      sql+='WHERE '
    }else{
      sql+='AND '
    }
    sql+='Type=? '
    sqlParams.push(req.body.type)
  }
  //12一页
  sql+='LIMIT ? , ? ;SELECT FOUND_ROWS() as count;'
  let page = parseInt(req.body.page);
  sqlParams.push(page*17)
  sqlParams.push(17)
  query(sql, sqlParams, function (err, result){
    if(err){
      res.json({
        succeed: false
      })
    }
    else{
      res.json({
        list:result[0],
        succeed: true,
        count:result[1][0].count
      })
    }
    res.end()
  })
})

router.use('/question/geQuestion', function (req, res) {
  let sql = sqlCommand.getQuestion;
  let sqlParams = [req.body.questionID]
  query(sql, sqlParams, function (err, result){
    if(err){
      res.json({
        succeed: false
      })
    }
    else{
      res.json({
        question:result[0],
        succeed: true
      })
    }
    res.end()
  })
})

router.use('/question/checkPower', function (req, res) {
  let sql = sqlCommand.checkQuestionPower;
  let sqlParams = [req.body.userID,req.body.questionID]
  query(sql, sqlParams, function (err, result){
    if(err){
      res.json({
        succeed: false,
        message: '无法查询'
      })
    }
    else if(result.length === 0){
      res.json({
        succeed: false,
        message: '权限不足'
      })
    }else{
      res.json({
        succeed: true
      })
    }
    res.end()
  })
})

router.use('/question/deleteQuestion', function (req, res) {
  let sql = sqlCommand.deleteQuestion;
  let sqlParams = [req.body.questionID]
  query(sql, sqlParams, function (err, result){
    if(err){
      res.json({
        succeed: false,
        message: '删除失败'
      })
    } else{
      res.json({
        succeed: true
      })
    }
    res.end()
  })
})


router.use('/paper/addPaper', function (req, res) {
  let sql = sqlCommand.insertPaper;
  let sqlParams = [req.body.paperName, req.body.course, req.body.userID, req.body.level]
  query(sql, sqlParams, function (err, result){
    if(err){
      res.json({
        succeed: false,
        message: '提交失败'
      })
    } else {
      sql = sqlCommand.insertPaperQuestion
      sqlParams = []
      for (let x of req.body.questionIDs)
        sqlParams.push([result[1][0].last, parseInt(x)])
      query(sql, [sqlParams], function (err, result) {
        if (err) {
          res.json({
            succeed: false,
            message: '提交失败'
          })
        } else {
          res.json({
            succeed: true,
            message: '提交成功'
          })
        }
        res.end()
      })
    }
  })
})

router.use('/paper/questionSelectList',function (req, res) {
  let sql = sqlCommand.getSelectedQuestion;
  let sqlParams = [req.body.selectIDs]
  query(sql, [sqlParams], function (err, result){
    if(err){
      res.json({
        succeed: false,
        message: '提交失败'
      })
    } else {
      res.json({
        list:result[0],
        succeed: true,
        count:result[1][0].count
      })
    }
    res.end()
  })
})

router.use('/paper/paperList', function (req, res) {
  let isHaveWhere = false
  let sql='SELECT SQL_CALC_FOUND_ROWS * FROM paper '
  let sqlParams = []
  if(req.body.search!==''){
    sql += 'WHERE Paper_name LIKE ? '
    isHaveWhere = true
    sqlParams.push("%"+req.body.search+"%")
  }
  if(req.body.bank!==''){
    if(!isHaveWhere){
      sql+='WHERE '
      isHaveWhere=true
    }else{
      sql+='AND '
    }
    sql+='Course=? '
    sqlParams.push(req.body.bank)
  }
  if(req.body.level!==''){
    if(!isHaveWhere){
      sql+='WHERE '
    }else{
      sql+='AND '
    }
    sql+='Paper_level=? '
    sqlParams.push(req.body.level)
  }
  //17一页
  sql+='LIMIT ? , ? ;SELECT FOUND_ROWS() as count;'
  let page = parseInt(req.body.page);
  sqlParams.push(page*17)
  sqlParams.push(17)
  query(sql, sqlParams, function (err, result){
    if(err){
      res.json({
        succeed: false
      })
    }
    else{
      res.json({
        list:result[0],
        succeed: true,
        count:result[1][0].count
      })
    }
    res.end()
  })
})

router.use('/paper/checkPower', function (req, res) {
  let sql = sqlCommand.checkPaperPower;
  let sqlParams = [req.body.userID,req.body.paperID]
  query(sql, sqlParams, function (err, result){
    if(err){
      res.json({
        succeed: false,
        message: '无法查询数据库'
      })
    }
    else if(result.length === 0){
      res.json({
        succeed: false,
        message: '权限不足'
      })
    }else{
      res.json({
        succeed: true
      })
    }
    res.end()
  })
})

router.use('/paper/deletePaper', function (req, res) {
  let sql = sqlCommand.deletePaper;
  let sqlParams = [req.body.paperID]
  query(sql, sqlParams, function (err, result){
    if(err){
      res.json({
        succeed: false,
        message: '删除失败'
      })
    } else{
      res.json({
        succeed: true
      })
    }
    res.end()
  })
})

router.use('/paper/randPaper', function (req, res) {
  let sql = sqlCommand.randQuestion+sqlCommand.randQuestion+sqlCommand.randQuestion;
  let sqlParams = ['填空题',parseInt(req.body.fillNum),'选择题',parseInt(req.body.selectNum),'简答题',parseInt(req.body.stickNum)]
  query(sql, sqlParams, function (err, result){
    if(err){
      res.json({
        succeed: false,
        message: '获取数据失败'
      })
    } else{
      res.json({
        succeed: true,
        fill:result[0],
        select:result[1],
        stick:result[2]
      })
    }
    res.end()
  })
})

router.use('/paper/getPaper', function (req, res) {
let sql = sqlCommand.getPaper
let sqlParams = [req.body.paperID,req.body.paperID,]
query(sql, sqlParams, function (err, result){
  if(err){
    res.json({
      succeed: false,
      message: '获取数据失败'
    })
  } else{
    res.json({
      succeed: true,
      paper:result[0][0],
      paperQuestionList:result[1]
    })
  }
  res.end()
})
})

router.use('/paper/getPaperQuestion', function (req, res) {
  let sql = sqlCommand.getPaperQusetion
  let sqlParams = [req.body.paperID]
  query(sql, sqlParams, function (err, result){
    if(err){
      res.json({
        succeed: false,
        message: '获取数据失败'
      })
    } else{
      res.json({
        succeed: true,
        list:result
      })
    }
    res.end()
  })
})

router.use('/paper/modifyPaper', function (req, res) {
  let sql = sqlCommand.deletePaperQuestion
  let sqlParams = [req.body.paperID]
  query(sql, sqlParams, function (err, result){
    if(err){
      res.json({
        succeed: false,
        message: '修改失败'
      })
    } else{
      sql = sqlCommand.insertPaperQuestion
      sqlParams = []
      for (let x of req.body.questionIDs)
        sqlParams.push([req.body.paperID, parseInt(x)])
      query(sql, [sqlParams], function (err, result) {
        if (err) {
          res.json({
            succeed: false,
            message: '修改失败'
          })
        } else {
          res.json({
            succeed: true,
            message: '修改成功'
          })
        }
        res.end()
        return
      })
    }
  })
})

router.use('/bank/getBank', function (req, res) {
  let sql = sqlCommand.getBanks;
  query(sql, {},function (err, result){
    if(err){
      res.json({
        succeed: false
      })
    }
    else{
      res.json({
        banks:result,
        succeed: true
      })
    }
    res.end()
  })
})

module.exports = router
