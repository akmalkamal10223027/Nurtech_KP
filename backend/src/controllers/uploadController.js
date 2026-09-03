const path = require('path');
const { formatMedia } = require('../utils/formatter');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

async function uploadToSupabase(file) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const ext = path.extname(file.originalname);
  const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '-');
  const filename = `${basename}-${uniqueSuffix}${ext}`;
  const uploadPath = `uploads/${filename}`;

  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/uploads/${uploadPath}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': file.mimetype,
      'x-upsert': 'true'
    },
    body: file.buffer
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gagal upload ke Supabase Storage: ${err}`);
  }

  // Public URL
  return `${SUPABASE_URL}/storage/v1/object/public/uploads/${uploadPath}`;
}

const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: { message: 'Tidak ada file yang diunggah.' } });
  }

  try {
    let fileUrl;
    if (SUPABASE_URL && SUPABASE_KEY && req.file.buffer) {
      fileUrl = await uploadToSupabase(req.file);
    } else {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    const formatted = formatMedia(fileUrl);
    return res.json([formatted]);
  } catch (error) {
    console.error('Upload error:', error.message);
    return res.status(500).json({ error: { message: error.message } });
  }
};

const uploadMultipleFiles = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: { message: 'Tidak ada file yang diunggah.' } });
  }

  try {
    const formatted = [];
    for (const f of req.files) {
      let fileUrl;
      if (SUPABASE_URL && SUPABASE_KEY && f.buffer) {
        fileUrl = await uploadToSupabase(f);
      } else {
        fileUrl = `/uploads/${f.filename}`;
      }
      formatted.push(formatMedia(fileUrl));
    }
    return res.json(formatted);
  } catch (error) {
    console.error('Upload multiple error:', error.message);
    return res.status(500).json({ error: { message: error.message } });
  }
};

module.exports = {
  uploadFile,
  uploadMultipleFiles
};
