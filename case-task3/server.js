const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('case-task3.db', sqlite3.OPEN_READWRITE);

const TOKEN_SECRET = 'hdgartwenftdosb4gaf343asfhsadlkjsada';

function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

function hashPassword(salt, password) {
  let hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  return hash.digest('hex');
}

function auth(req, res, next) {
  const token = req.get('token');
  if (token == null) return res.status(401).send('No token');
  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) return res.status(401).send('Token not good');
    req.userId = user.userId;
    next();
  });
}

app.post('/login', (req, res) => {
  db.all('SELECT id, passwordHashSalt, passwordHash FROM users WHERE name=?', req.body.user, (err, users) => {
    if (err) return res.status(500).send('DB Error');
    if (users.length != 1) return res.status(401).send('User not found');
    const user = users[0];
    
    if(hashPassword(user.passwordHashSalt, req.body.password) !== user.passwordHash)
      return res.status(401).send('Wrong password');
    const token = jwt.sign({ userId: user.id }, TOKEN_SECRET, { expiresIn: '60s' }); // expiresIn - время жизни токена
    res.send(token);
  });
});

app.post('/register', (req, res) => {
  const salt = generateSalt();
  db.run("INSERT INTO users(name, passwordHashSalt, passwordHash) VALUES ($name, $salt, $passwordHash)",
  { 
    $name: req.body.user,
    $salt: salt,
    $passwordHash: hashPassword(salt, req.body.password)
  },
  (err) => {
    if (err) return res.status(500).send(err);
    res.send('Created');
  });
});

// Маршрут для получения задач
app.get('/tasks', auth, (req, res) => {
  // req.userId устанавливается в auth из токена
  db.all('SELECT id, title, description, due_date FROM tasks WHERE user_id=?', req.userId, (err, tasks) => {
    if (err) return res.status(500).send('DB Error');
    res.json(tasks); 
  });  
});

// Маршрут для добавления задачи
app.post('/tasks', auth, (req, res) => {
  db.run("INSERT INTO tasks(title, description, due_date, user_id) VALUES ($title, $description, $due_date, $user_id)",
  { 
    $title: req.body.title, 
    $description: req.body.description, 
    $due_date: req.body.due_date, 
    $user_id: req.userId // устанавливается в auth
  },
  (err) => {
    if (err) return res.status(500).send(err);
    res.send('Created task');
  });
});

// Маршрут для обновления задачи
app.put('/tasks', auth, (req, res) => {
  db.run("UPDATE tasks SET title=$title, description=$description, due_date=$due_date WHERE id=$id AND user_id=$user_id",
  { 
    $id: req.body.id, 
    $title: req.body.title, 
    $description: req.body.description, 
    $due_date: req.body.due_date, 
    $user_id: req.userId  // устанавливается в auth
  },
  (err) => {
    if (err) return res.status(500).send(err);
    res.send('Updated task');
  });
});

// Маршрут для удаления задачи
app.delete('/tasks', auth, (req, res) => {
  db.run("DELETE FROM tasks WHERE id=$id AND user_id=$user_id",
  { 
    $id: req.body.id, 
    $user_id: req.userId  // устанавливается в auth
  },
  (err) => {
    if (err) return res.status(500).send(err);
    res.send('Deleted task');
  });
});

// Запуск сервера
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});