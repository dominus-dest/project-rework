const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mern-texts', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once('open', () => console.log('Connected to MongoDB'));

// Create a model for your text entries
const Note = mongoose.model('Note', { text: String });

// Create a route to save text to the database
app.post('/api/texts', async (req, res) => {
  const { text } = req.body;
  const newTextEntry = new Note({ text });
  await newTextEntry.save();
  res.status(201).json(newTextEntry);
});

app.delete('/api/texts/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Deleting text with ID:', id);
    try {
      await Note.findByIdAndDelete(id);
      console.log('Text deleted successfully');
      res.sendStatus(204);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Server error');
    }
  });
  
// Create a route to fetch all texts from the database
app.get('/api/texts', async (req, res) => {
  const texts = await Note.find();
  res.json(texts);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
