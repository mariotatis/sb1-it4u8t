const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database(':memory:');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create posts table
db.run(`CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  content TEXT,
  position INTEGER
)`);

app.get('/', (req, res) => {
  db.all('SELECT * FROM posts ORDER BY position ASC', (err, posts) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.render('index', { posts });
    }
  });
});

app.get('/new', (req, res) => {
  res.render('new');
});

app.post('/new', (req, res) => {
  const { title, content } = req.body;
  db.run('INSERT INTO posts (title, content, position) VALUES (?, ?, (SELECT IFNULL(MAX(position), 0) + 1 FROM posts))', [title, content], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/');
    }
  });
});

app.get('/edit/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM posts WHERE id = ?', [id], (err, post) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else if (!post) {
      res.status(404).send('Post not found');
    } else {
      res.render('edit', { post });
    }
  });
});

app.post('/edit/:id', (req, res) => {
  const id = req.params.id;
  const { title, content } = req.body;
  db.run('UPDATE posts SET title = ?, content = ? WHERE id = ?', [title, content, id], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/');
    }
  });
});

app.post('/delete/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM posts WHERE id = ?', [id], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/');
    }
  });
});

app.post('/reorder', (req, res) => {
  const { positions } = req.body;
  const updates = positions.map(({ id, position }) => {
    return new Promise((resolve, reject) => {
      db.run('UPDATE posts SET position = ? WHERE id = ?', [position, id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });

  Promise.all(updates)
    .then(() => res.sendStatus(200))
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});