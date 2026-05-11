import express from 'express';

const router = express.Router();
const db = global.db;

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);
  if (user) {
    if (user.status === 'pending') {
      return res.status(403).json({ error: '账号待审核' });
    }
    res.json({ id: user.id, username: user.username, role: user.role });
  } else {
    res.status(401).json({ error: '用户名或密码错误' });
  }
});

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  try {
    db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, password);
    res.json({ message: '注册成功，请等待审核' });
  } catch (e) {
    res.status(400).json({ error: '用户名已存在' });
  }
});

router.get('/', (req, res) => {
  const users = db.prepare('SELECT id, username, role, status, create_time FROM users').all();
  res.json(users);
});

router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE users SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ message: '状态更新成功' });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.json({ message: '删除成功' });
});

router.get('/:id/stats', (req, res) => {
  let stats = db.prepare('SELECT * FROM learning_stats WHERE user_id = ?').get(req.params.id);
  if (!stats) {
    db.prepare('INSERT INTO learning_stats (user_id) VALUES (?)').run(req.params.id);
    stats = db.prepare('SELECT * FROM learning_stats WHERE user_id = ?').get(req.params.id);
  }
  res.json(stats);
});

export default router;