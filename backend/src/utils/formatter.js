const formatMedia = (mediaInput, baseUrl = process.env.API_BASE_URL || 'http://localhost:1337') => {
  if (!mediaInput) return null;
  const url = typeof mediaInput === 'string' ? mediaInput : (mediaInput.url || '');
  if (!url) return null;
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  return {
    id: 1,
    documentId: 'media-' + Math.random().toString(36).substring(2, 9),
    url: fullUrl,
    name: url.split('/').pop() || 'media.png',
    alternativeText: '',
    caption: '',
    width: 800,
    height: 600,
    formats: {
      thumbnail: { url: fullUrl },
      small: { url: fullUrl },
      medium: { url: fullUrl },
      large: { url: fullUrl }
    }
  };
};

const sendResponse = (res, data, pagination = null, statusCode = 200) => {
  const meta = pagination
    ? {
        pagination: {
          page: pagination.page || 1,
          pageSize: pagination.pageSize || 10,
          pageCount: Math.ceil((pagination.total || 0) / (pagination.pageSize || 10)) || 1,
          total: pagination.total || 0
        }
      }
    : {};
  return res.status(statusCode).json({ data, meta });
};

module.exports = {
  formatMedia,
  sendResponse
};
