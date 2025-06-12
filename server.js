const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 2024;

app.use(cors());
app.use(express.json());

// Fichier JSON
const DATA_FILE = __dirname + '/data/stories.json';

// GET - Lire les stories
app.get('/get', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: "Erreur de lecture" });
    const json = JSON.parse(data || '{ "stories": [] }');
    res.json(json);
  });
});

// POST - Enregistrer une nouvelle story
app.post('/send', (req, res) => {
  const { story } = req.body;
  if (!story || story.length < 5) return res.status(400).json({ error: 'Message trop court' });

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    const json = JSON.parse(data || '{ "stories": [] }');
    json.stories.push(story);
    fs.writeFile(DATA_FILE, JSON.stringify(json, null, 2), err => {
      if (err) return res.status(500).json({ error: "Erreur d'écriture" });
      res.json({ success: true });
    });
  });
});

app.listen(PORT, () => console.log('✅ Serveur actif sur le port', PORT));
