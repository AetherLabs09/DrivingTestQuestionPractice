import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../db/exam.db');
const Database = (await import('better-sqlite3')).default;
const db = new Database(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  status TEXT DEFAULT 'pending',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  options TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending',
  error_correction TEXT,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  review_time DATETIME,
  review_by INTEGER
);

CREATE TABLE IF NOT EXISTS user_answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  question_id INTEGER NOT NULL,
  user_answer TEXT NOT NULL,
  is_correct INTEGER DEFAULT 0,
  answer_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

CREATE TABLE IF NOT EXISTS learning_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  total_questions INTEGER DEFAULT 0,
  correct_questions INTEGER DEFAULT 0,
  practice_count INTEGER DEFAULT 0,
  exam_passed INTEGER DEFAULT 0,
  last_practice DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  reply TEXT,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  reply_time DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS ad_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cheat_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  behavior TEXT NOT NULL,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS violation_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  violation_type TEXT NOT NULL,
  punishment TEXT NOT NULL,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
`);

const insertInitData = db.transaction(() => {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userCount.count === 0) {
    db.prepare(`INSERT INTO users (username, password, role, status) VALUES (?, ?, ?, ?)`).run('admin', 'admin123', 'admin', 'approved');
    db.prepare(`INSERT INTO users (username, password, role, status) VALUES (?, ?, ?, ?)`).run('testuser', 'test123', 'user', 'approved');
  }

  const questionCount = db.prepare('SELECT COUNT(*) as count FROM questions').get();
  if (questionCount.count === 0) {
    const questions = [
      ['根据《中华人民共和国道路交通安全法》，驾驶机动车上道路行驶，应当悬挂机动车号牌，放置检验合格标志、保险标志，并随车携带机动车行驶证。', '{"A":"正确","B":"错误"}', 'A', '科目一', 1, 'approved'],
      ['机动车驾驶人在一个记分周期内累积记分达到12分的，公安机关交通管理部门应当扣留其机动车驾驶证。', '{"A":"正确","B":"错误"}', 'A', '科目一', 1, 'approved'],
      ['驾驶机动车在道路上追逐竞驶，情节恶劣的，处拘役，并处罚金。', '{"A":"正确","B":"错误"}', 'A', '科目一', 2, 'approved'],
      ['夜间会车应当在距对方来车多少米以外改用近光灯？', '{"A":"50米","B":"100米","C":"150米","D":"200米"}', 'C', '科目一', 2, 'approved'],
      ['机动车通过急弯路时，最高时速不得超过多少？', '{"A":"20公里","B":"30公里","C":"40公里","D":"50公里"}', 'B', '科目一', 2, 'approved'],
      ['车辆驶入匝道后，迅速将车速提高到每小时60公里以上。', '{"A":"正确","B":"错误"}', 'B', '科目一', 1, 'pending'],
      ['在高速公路上行驶，时速低于100公里，与前车距离不得少于多少米？', '{"A":"30米","B":"50米","C":"100米","D":"200米"}', 'B', '科目一', 2, 'pending'],
      ['科目二考试包括哪些项目？', '{"A":"倒车入库","B":"坡道定点停车和起步","C":"侧方停车","D":"曲线行驶","E":"直角转弯"}', 'ABCDE', '科目二', 2, 'approved'],
      ['发动机起动后，水温达到多少度时才能正常行驶？', '{"A":"40℃","B":"60℃","C":"80℃","D":"100℃"}', 'C', '科目二', 2, 'approved'],
      ['在冰雪路面行驶时，应当增大与前车的距离。', '{"A":"正确","B":"错误"}', 'A', '科目一', 1, 'approved']
    ];
    const stmt = db.prepare(`INSERT INTO questions (content, options, answer, category, difficulty, status) VALUES (?, ?, ?, ?, ?, ?)`);
    for (const q of questions) {
      stmt.run(...q);
    }
  }
});

insertInitData();

global.db = db;

const { default: userRoutes } = await import('./routes/users.js');
const { default: questionRoutes } = await import('./routes/questions.js');
const { default: statsRoutes } = await import('./routes/stats.js');
const { default: feedbackRoutes } = await import('./routes/feedback.js');
const { default: adRoutes } = await import('./routes/ads.js');
const { default: riskRoutes } = await import('./routes/risk.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/risk', riskRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on port ${PORT}`);
});