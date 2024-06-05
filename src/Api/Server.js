import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import sqlite3 from 'sqlite3';


const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, completed BOOLEAN)');
});

app.get('/todos', (req, res) => {
  db.all('SELECT * FROM todos', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/todos', (req, res) => {
  const { text, completed } = req.body;

  db.run('INSERT INTO todos (text, completed) VALUES (?, ?)', [text, completed], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, text, completed });
  });
});

app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;

  db.run('UPDATE todos SET text = ?, completed = ? WHERE id = ?', [text, completed, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, text, completed });
  });
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM todos WHERE id = ?', id, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
