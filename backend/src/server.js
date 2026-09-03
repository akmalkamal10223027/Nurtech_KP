require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middlewares/error');

const app = express();
const PORT = process.env.PORT || 1337;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root healthcheck
app.get('/', (req, res) => {
  res.json({
    name: 'Nurtech School REST API',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', apiRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start Server locally (if not imported as serverless function)
if (process.env.NODE_ENV !== 'production' || require.main === module) {
  app.listen(PORT, () => {
    console.log(`=============================================`);
    console.log(`  Nurtech School Express Server is Running!  `);
    console.log(`  Port: http://localhost:${PORT}             `);
    console.log(`  API Base: http://localhost:${PORT}/api     `);
    console.log(`=============================================`);
  });
}

module.exports = app;
