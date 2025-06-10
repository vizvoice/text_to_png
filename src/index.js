const express = require('express');
const text2png = require('text2png');
const app = express();
app.use(express.json());

app.post('/generate', (req, res) => {
  const text = req.body.text || 'Hello World';
  const buffer = text2png(text, {
    font: 'bold 60px Arial',
    color: 'black',
    backgroundColor: 'white',
    padding: 20,
    lineSpacing: 10,
  });
  res.set('Content-Type', 'image/png');
  res.send(buffer);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
