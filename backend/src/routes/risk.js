import express from 'express';

const router = express.Router();
const db = global.db;

router.get('/cheat-logs', (req, res) => {
  const logs = db.prepare(`
    SELECT cl.*, u.username FROM cheat_logs cl
    JOIN users u ON cl.user_id = u.id
    ORDER BY cl.create_time DESC
    LIMIT 100
  `).all();
  res.json(logs);
});

router.post('/cheat-log', (req, res) => {
  const { user_id, behavior } = req.body;
  db.prepare('INSERT INTO cheat_logs (user_id, behavior) VALUES (?, ?)').run(user_id, behavior);
  res.json({ message: '作弊记录已添加' });
});

router.get('/violations', (req, res) => {
  const violations = db.prepare(`
    SELECT v.*, u.username FROM violation_users v
    JOIN users u ON v.user_id = u.id
    ORDER BY v.create_time DESC
  `).all();
  res.json(violations);
});

router.post('/violation', (req, res) => {
  const { user_id, violation_type, punishment } = req.body;
  db.prepare('INSERT INTO violation_users (user_id, violation_type, punishment) VALUES (?, ?, ?)')
    .run(user_id, violation_type, punishment);
  db.prepare('UPDATE users SET status = ? WHERE id = ?').run('banned', user_id);
  res.json({ message: '违规处理已完成' });
});

router.post('/check-speed', (req, res) => {
  const { user_id, question_id, time_diff } = req.body;
  if (time_diff < 2) {
    db.prepare('INSERT INTO cheat_logs (user_id, behavior) VALUES (?, ?)')
      .run(user_id, `异常快速答题: ${time_diff}秒`);
    res.json({ flagged: true, reason: '答题速度异常' });
  } else {
    res.json({ flagged: false });
  }
});

export default router;