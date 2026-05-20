const { Pool } = require('pg');
const logger = require('./logger');
require('dotenv').config();

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.connect()
  .then(() => logger.info('✅ Connected to Postgres DB'))
  .catch(err => logger.error(`❌ DB Connection Error: ${err}`));

module.exports = pool;