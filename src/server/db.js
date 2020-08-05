const mysql = require('mysql')
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '199945748abc',
  database: 'testbase',
  multipleStatements: true,
  dateStrings: true
})
const query = function (sql, sqlParams, callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      callback(err, null, null)
    } else {
      conn.query(sql, sqlParams, function (qerr, vals) {
        conn.release()
        callback(qerr, vals)
      })
    }
  })
}
module.exports = query
