const path = require('path');
const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// INDISPENSABLE pour que freeCodeCamp puisse interroger ton API
app.use(cors({ optionsSuccessStatus: 200 }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/fileanalyse', upload.single('upfile'), (request, response) => {
  if (!request.file) {
    return response.status(400).json({ error: 'Please upload a file using the upfile field.' });
  }

  return response.json({
    name: request.file.originalname,
    type: request.file.mimetype,
    size: request.file.size
  });
});

app.use((error, request, response, next) => {
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
    return response.status(413).json({ error: 'File is too large. The limit is 10 MB.' });
  }

  return next(error);
});

app.listen(port, () => {
  console.log(`File metadata service listening on port ${port}`);
});