const fs = require('fs');
const express = require('express');
const path = require('path');
// Helper method for generating unique ids
// const uuid = require('./helpers/uuid');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      res.json(parsedData)
    }
  });
});

app.post('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      const newNote = req.body;
      const newNoteId = parsedData.length + 1; // generate new id for the note
      newNote.id = newNoteId.toString(); // assign new id to the note
      parsedData.push(newNote);
      fs.writeFile('./db/db.json', JSON.stringify(parsedData), 'utf8', (err) => {
        if (err) {
          console.error(err);
        } else {
          res.json(newNote);
        }
      });
    }
  });
});

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);
// app.post() 
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);



app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id; // get the id from the request parameters
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      const updatedData = parsedData.filter(note => note.id !== id); // remove the note with the given id
      fs.writeFile('./db/db.json', JSON.stringify(updatedData), 'utf8', (err) => {
        if (err) {
          console.error(err);
        } else {
          res.json({ message: `Note with id ${id} deleted.` }); // send a response indicating that the note was deleted
        }
      });
    }
  });
});