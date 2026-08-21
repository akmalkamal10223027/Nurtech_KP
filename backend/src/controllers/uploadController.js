const { formatMedia } = require('../utils/formatter');

const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: { message: 'Tidak ada file yang diunggah.' } });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  const formatted = formatMedia(fileUrl);

  return res.json([formatted]);
};

const uploadMultipleFiles = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: { message: 'Tidak ada file yang diunggah.' } });
  }

  const formatted = req.files.map(f => formatMedia(`/uploads/${f.filename}`));
  return res.json(formatted);
};

module.exports = {
  uploadFile,
  uploadMultipleFiles
};
