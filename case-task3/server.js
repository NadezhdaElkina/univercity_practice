const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const tasksFile = './tasks.json'; 

// Маршрут для получения задач
app.get('/tasks', (req, res) => {
  fs.readFile(tasksFile, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading tasks file');
    }
    const tasks = JSON.parse(data);//проверка!!!
    console.log('Tasks sent to client:', tasks);  // Логирование задач проверка!!!! почему не добавляется таска в список
    res.json(JSON.parse(data)); 
  });
});

// Маршрут для добавления задачи
app.post('/tasks', (req, res) => {
  const newTask = {
    id: Date.now(), 
    title: req.body.title,
    description: req.body.description,
    due_date: req.body.due_date,
    user_id: req.body.user_id, 
  };

  fs.readFile(tasksFile, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading tasks file');
    }

    const tasks = JSON.parse(data);
    tasks.push(newTask); 

    fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error saving tasks');
      }
      res.status(201).json(newTask); // Отправляем обратно данные о добавленной задаче
    });
  });
});

// Запуск сервера
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});