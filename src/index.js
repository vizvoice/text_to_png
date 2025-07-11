const express = require('express');
const text2png = require('text2png');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());

// Pad naar het fontbestand (in dezelfde map als dit bestand)
const customFontPath = path.join(__dirname, 'poppins.light-italic.ttf');

// Presets per producttype met de juiste font-oproep
const presets = {
  tshirt:   { font: 'italic light 80px Poppins', padding: 300, lineSpacing: 20, width: 3600, height: 4800 },
  mug:      { font: 'italic light 50px Poppins', padding: 150, lineSpacing: 10, width: 2700, height: 1050 },
  cap:      { font: 'italic light 40px Poppins', padding: 100, lineSpacing: 8,  width: 2000, height: 1000 },
  totebag:  { font: 'italic light 70px Poppins', padding: 250, lineSpacing: 15, width: 3600, height: 3600 },
  hoodie:   { font: 'italic light 70px Poppins', padding: 300, lineSpacing: 20, width: 3600, height: 4800 },
  poster:   { font: 'italic light 100px Poppins', padding: 400, lineSpacing: 30, width: 4800, height: 6400 },
  sticker:  { font: 'italic light 60px Poppins', padding: 100, lineSpacing: 15, width: 2000, height: 2000 },
  notebook: { font: 'italic light 70px Poppins', padding: 150, lineSpacing: 15, width: 1600, height: 2400 },
  babybody: { font: 'italic light 50px Poppins', padding: 200, lineSpacing: 15, width: 2800, height: 3600 },
};


app.post('/generate', (req, res) => {
  const inputText = req.body.slogan || 'Helloooo World';
  const product = req.body.product || 'tshirt';
  const color = req.body.color || 'black';
  const maxWordsPerLine = req.body.maxWordsPerLine || 3;

  const config = presets[product] || presets.tshirt;

  // Regelsplitsing voor langere slogans
  const words = inputText.split(' ');
  const lines = [];
  for (let i = 0; i < words.length; i += maxWordsPerLine) {
    lines.push(words.slice(i, i + maxWordsPerLine).join(' '));
  }
  const multilineText = lines.join('\n');

  // Bestandsnaam genereren uit slogan
  const rawFilename = inputText
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .substring(0, 50);
  const filename = `${rawFilename || 'slogan_output'}.png`;

  const buffer = text2png(multilineText, {
    ...config,
    color: color,
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontPath: customFontPath,
  });

  res.set('Content-Type', 'image/png');
  res.set('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(buffer);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Listening on port ${port}`));
