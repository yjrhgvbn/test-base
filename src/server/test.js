const sqlCommand = require('../server/sqlCommand')
const express = require('express')
const router = express.Router()
const query = require('./db')

let sql = sqlCommand.getSelectedQuestion;
let sqlParams = [[1,2,3,4,5,6]]
query(sql, [sqlParams], function (err, result){
  if(err){
    console.log(err)
  } else {
    console.log(result[1][0])
  }
})
