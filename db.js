const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = 3000
const DB_URL = `mongodb+srv://user:user1@clusterchat.pwaivdw.mongodb.net/?retryWrites=true&w=majority`

// Setting up Express to handle static files and parse JSON
app.use(express.static('notes'));
app.use(express.json());

// Database connection 
async function startApp() {
  try {
    await mongoose.connect(DB_URL, { useUnifiedTopology: true, useNewUrlParser: true })
    app.listen(PORT, () => {
      console.log(`Server started on port: ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}
startApp()
const db = mongoose.connection;
const User = mongoose.model('User', {
  username: String,
});
const Note = mongoose.model('Note', {
  username: String,
  note: String
});


app.get('/api/data/check-username', (req, res) => {
  const { username } = req.query;

  // Checking if the username exists in the database
  db.collection('users').findOne({ username }, (err, result) => {
    if (err) {
      console.error('Ошибка при выполнении запроса:', err);
      res.sendStatus(500);
      return;
    }

    // Sending a response with the result of the check
    const exists = result !== null;
    res.json({ exists });
  });
});

app.post('/api/data/username', (req, res) => {
  const { username } = req.body;
  const user = new User({ username });

  // Saving the user in the database
  user.save()
    .then(() => {
      res.json({ status: 'success', message: 'Username saved successfully' });
    })
    .catch((error) => {
      console.error('Ошибка при сохранении имени пользователя:', error);
      res.sendStatus(500);
    });
});


app.get('/api/data/get-notes', async (req, res) => {
  const { username } = req.query;

  try {
    // Get all notes for a specified user
    const notes = await Note.find({ username });

    // Create an array of notes to send to the client
    const notesData = notes.map(note => ({ content: note.note }));

    // Send notes as a reply
    res.json(notesData);
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    res.sendStatus(500);
  }
});

app.post('/notes', (req, res) => {
  const { username, note } = req.body;

  const notes = new Note({ username, note });

  notes.save()
    .then(() => {
      res.json({ success: true });
    })
    .catch(error => {
      console.error('Ошибка при сохранении данных:', error);
      res.status(500).json({ error: 'Ошибка при сохранении данных' });
    });
});
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/notes/chat.html');
});
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});