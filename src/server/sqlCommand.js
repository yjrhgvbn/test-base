const sqlStatement = {
  insertUser: 'INSERT INTO user(User_name, User_id, Password, Email, Power) VALUES (?, ?, ?, ?, \'查改\');',
  selectUserAndPassword: 'select * from user where User_name = ? and Password = ?;',
  selectUser: 'select * from user where User_name = ?;',
  deleteUser:'DELETE FROM user WHERE User_id = ?;',
  updateUserPower:'UPDATE user SET Power=? WHERE User_id=?;',
  updateUser:"UPDATE user SET User_name = ?, Password = ?, Email = ? WHERE User_id = ? AND Password = ?;",
  checkAdmin:"SELECT * FROM user WHERE User_id=? AND Power='管理员';",
  checkModifyPower:"SELECT * FROM user WHERE User_id=? AND Power<>'仅查';",
  getBanks:'SELECT bank.Bank_name FROM bank;',

  insertQuestion:'INSERT INTO question(Type, Describtion, Anser,Bank_name, Question_level, User_id, Picture)'+
    'SELECT ?, ?, ?, ?, ?, ?, ? FROM DUAL WHERE EXISTS(SELECT * FROM user WHERE User_id=? AND Power<>\'仅查\');',
  getQuestion:"SELECT * FROM question WHERE Question_id=?;",
  updateQuestion:'UPDATE question SET Type=?, Describtion =?, Anser =?, Bank_name = ?, Question_level =?,'+
    ' User_id = ?, Picture =? WHERE Question_id = ?;',
  checkQuestionPower:'SELECT * FROM user WHERE User_id = ? AND ' +
    '(Power=\'管理员\' OR User_id = (SELECT question.User_id FROM question WHERE Question_id=?))',
  deleteQuestion:'DELETE FROM question WHERE Question_id = ?;',
  randQuestion:'SELECT * FROM question WHERE Question_id >= ((SELECT MAX(Question_id) FROM question)-(SELECT ' +
    'MIN(Question_id) FROM question)) * RAND() + (SELECT MIN(Question_id) FROM question) AND Type=? LIMIT ?;',

  insertPaper:"INSERT INTO `testbase`.`paper`(`Paper_name`, `Course`, `User_id`, `Paper_level`, `Date`) " +
    "VALUES (?, ?, ?, ?, CURDATE());select last_insert_id() as last;",
  insertPaperQuestion:"INSERT INTO paper_question(Paper_id, Question_id) VALUES ?",
  checkPaperPower:"SELECT * FROM user WHERE User_id = ? AND (Power='管理员' OR User_id = " +
    "(SELECT paper.User_id FROM paper WHERE Paper_id=?));\n",
  getPaper:"SELECT * FROM paper WHERE Paper_id=?;SELECT Question_id FROM paper_question WHERE Paper_id=?;",
  getSelectedQuestion:"SELECT SQL_CALC_FOUND_ROWS * FROM question WHERE Question_id IN ?;SELECT FOUND_ROWS() as count;",
  updatePaper:'UPDATE paper SET Paper_name = ?,Course =?, Paper_level=?, Date=CURDATE() WHERE Paper_id = ?;',
  deletePaper:'DELETE FROM paper WHERE Paper_id = ?;',
  deletePaperQuestion:'DELETE FROM paper_question WHERE Paper_id = ?;',
  getPaperDetail:'SELECT * FROM paper WHERE Paper_id=?;' +
    'SELECT * FROM question a JOIN paper_question b ON a.Question_id = b.Question_id  WHERE Paper_id=?;',
  getPaperQusetion:'SELECT * FROM question a RIGHT JOIN paper_question b ON a.Question_id = b.Question_id  WHERE Paper_id=?;',
  
}
module.exports = sqlStatement
