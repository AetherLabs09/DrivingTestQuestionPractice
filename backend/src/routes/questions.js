import express from 'express';

const router = express.Router();
const db = global.db;

router.get('/', (req, res) => {
  const { status, category, difficulty } = req.query;
  let sql = 'SELECT * FROM questions WHERE 1=1';
  const params = [];
  if (status) { sql += ' AND status = ?'; params.push(status); }
  if (category) { sql += ' AND category = ?'; params.push(category); }
  if (difficulty) { sql += ' AND difficulty = ?'; params.push(difficulty); }
  const questions = db.prepare(sql).all(...params);
  res.json(questions.map(q => ({ ...q, options: JSON.parse(q.options) })));
});

router.get('/:id', (req, res) => {
  const question = db.prepare('SELECT * FROM questions WHERE id = ?').get(req.params.id);
  if (question) {
    res.json({ ...question, options: JSON.parse(question.options) });
  } else {
    res.status(404).json({ error: '题目不存在' });
  }
});

router.post('/', (req, res) => {
  const { content, options, answer, category, difficulty } = req.body;
  const result = db.prepare(
    'INSERT INTO questions (content, options, answer, category, difficulty) VALUES (?, ?, ?, ?, ?)'
  ).run(content, JSON.stringify(options), answer, category, difficulty || 1);
  res.json({ id: result.lastInsertRowid, message: '题目创建成功' });
});

router.put('/:id', (req, res) => {
  const { content, options, answer, category, difficulty, status, error_correction } = req.body;
  db.prepare(
    'UPDATE questions SET content = ?, options = ?, answer = ?, category = ?, difficulty = ?, status = ?, error_correction = ?, review_time = CURRENT_TIMESTAMP WHERE id = ?'
  ).run(content, JSON.stringify(options), answer, category, difficulty, status, error_correction, req.params.id);
  res.json({ message: '题目更新成功' });
});

router.put('/:id/review', (req, res) => {
  const { status, review_by } = req.body;
  db.prepare(
    'UPDATE questions SET status = ?, review_time = CURRENT_TIMESTAMP, review_by = ? WHERE id = ?'
  ).run(status, review_by, req.params.id);
  res.json({ message: '审核完成' });
});

router.put('/:id/correct', (req, res) => {
  const { error_correction } = req.body;
  db.prepare('UPDATE questions SET error_correction = ? WHERE id = ?').run(error_correction, req.params.id);
  res.json({ message: '错题修正已提交' });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM questions WHERE id = ?').run(req.params.id);
  res.json({ message: '删除成功' });
});

export default router;