// routes/uploadRoutes.js
const express = require('express');
const multer = require('multer');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  // Read and parse the file content
  try {
    const jsonContent = JSON.parse(file.buffer.toString());

    // Validate the JSON content here
    if (!jsonContent.game || !Array.isArray(jsonContent.game)) {
      return res.status(400).json({ success: false, message: 'Invalid JSON format.' });
    }

    // Respond with the parsed JSON content if valid
    res.json({ success: true, data: jsonContent });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Invalid JSON file.' });
  }
});

router.post('/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

module.exports = router;
