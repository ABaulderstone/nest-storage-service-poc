const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
const upload = multer({ dest: 'uploads/' });

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(express.json());
app.get('/test', (req, res) => {
  res.send('Hello, world');
});

app.post('/mock-s3/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  const key = `${uuidv4()}-${file.originalname}`;
  const filePath = path.join(uploadDir, key);
  fs.renameSync(file.path, filePath);
  res.json({ key });
});

app.get('/mock-s3/presigned/:key', (req, res) => {
  const { key } = req.params;
  const filePath = path.join(uploadDir, key);
  if (fs.existsSync(filePath)) {
    return res.json({ url: `http://localhost:3001/mock-s3/download/${key}` });
  }
  return res.status(404).send('File not found');
});

app.get('/mock-s3/download/:key', (req, res) => {
  const { key } = req.params;
  const filePath = path.join(uploadDir, key);
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }
  return res.status(404).send('File not found');
});

app.listen(Number(process.env.PORT) || 3001, () => {
  console.log('Storage service running');
});
