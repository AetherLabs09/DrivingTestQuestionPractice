import express from 'express';

const router = express.Router();
const db = global.db;

router.get('/', (req, res) => {
  const { status } = req.query;
  let sql = 'SELECT * FROM ad_content';
  if (status) sql += ' WHERE status = ?';
  sql += ' ORDER BY create_time DESC';
  const ads = status ? db.prepare(sql).all(status) : db.prepare(sql).all();
  res.json(ads);
});

router.post('/', (req, res) => {
  const { content } = req.body;
  db.prepare('INSERT INTO ad_content (content) VALUES (?)').run(content);
  res.json({ message: '广告内容已添加' });
});

router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE ad_content SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ message: '状态更新成功' });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM ad_content WHERE id = ?').run(req.params.id);
  res.json({ message: '删除成功' });
});

export default router;