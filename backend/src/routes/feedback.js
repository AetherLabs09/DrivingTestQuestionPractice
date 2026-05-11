import express from 'express';

const router = express.Router();
const db = global.db;

router.get('/', (req, res) => {
  const { status } = req.query;
  let sql = 'SELECT f.*, u.username FROM feedback f JOIN users u ON f.user_id = u.id';
  if (status) sql += ' WHERE f.status = ?';
  sql += ' ORDER BY f.create_time DESC';
  const feedbacks = status ? db.prepare(sql).all(status) : db.prepare(sql).all();
  res.json(feedbacks);
});

router.post('/', (req, res) => {
  const { user_id, content } = req.body;
  db.prepare('INSERT INTO feedback (user_id, content) VALUES (?, ?)').run(user_id, content);
  res.json({ message: '反馈已提交' });
});

router.put('/:id/reply', (req, res) => {
  const { reply } = req.body;
  db.prepare('UPDATE feedback SET reply = ?, status = ?, reply_time = CURRENT_TIMESTAMP WHERE id = ?')
    .run(reply, 'replied', req.params.id);
  res.json({ message: '回复成功' });
});

router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE feedback SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ message: '状态更新成功' });
});

export default router;