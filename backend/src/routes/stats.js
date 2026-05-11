import express from 'express';

const router = express.Router();
const db = global.db;

router.get('/overview', (req, res) => {
  const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('user').count;
  const pendingUsers = db.prepare('SELECT COUNT(*) as count FROM users WHERE status = ? AND role = ?').get('pending', 'user').count;
  const totalQuestions = db.prepare('SELECT COUNT(*) as count FROM questions').get().count;
  const pendingQuestions = db.prepare('SELECT COUNT(*) as count FROM questions WHERE status = ?').get('pending').count;
  const pendingFeedback = db.prepare('SELECT COUNT(*) as count FROM feedback WHERE status = ?').get('pending').count;
  const pendingAds = db.prepare('SELECT COUNT(*) as count FROM ad_content WHERE status = ?').get('pending').count;

  res.json({
    totalUsers, pendingUsers, totalQuestions, pendingQuestions, pendingFeedback, pendingAds
  });
});

router.get('/user-activity', (req, res) => {
  const stats = db.prepare(`
    SELECT u.username, ls.total_questions, ls.correct_questions, ls.practice_count, ls.last_practice
    FROM learning_stats ls
    JOIN users u ON ls.user_id = u.id
    ORDER BY ls.last_practice DESC
    LIMIT 100
  `).all();
  res.json(stats);
});

router.get('/answer-rate', (req, res) => {
  const stats = db.prepare(`
    SELECT q.category, COUNT(ua.id) as total,
           SUM(ua.is_correct) as correct,
           ROUND(CAST(SUM(ua.is_correct) AS FLOAT) / COUNT(ua.id) * 100, 2) as rate
    FROM user_answers ua
    JOIN questions q ON ua.question_id = q.id
    GROUP BY q.category
  `).all();
  res.json(stats);
});

router.get('/pass-rate', (req, res) => {
  const passRate = db.prepare(`
    SELECT 
      COUNT(CASE WHEN exam_passed = 1 THEN 1 END) as passed,
      COUNT(*) as total,
      ROUND(CAST(COUNT(CASE WHEN exam_passed = 1 THEN 1 END) AS FLOAT) / COUNT(*) * 100, 2) as rate
    FROM learning_stats
  `).get();
  res.json(passRate);
});

router.get('/hot-topics', (req, res) => {
  const topics = db.prepare(`
    SELECT q.category, q.content, COUNT(ua.id) as answer_count,
           ROUND(CAST(SUM(ua.is_correct) AS FLOAT) / COUNT(ua.id) * 100, 2) as error_rate
    FROM user_answers ua
    JOIN questions q ON ua.question_id = q.id
    GROUP BY ua.question_id
    ORDER BY answer_count DESC
    LIMIT 10
  `).all();
  res.json(topics);
});

export default router;