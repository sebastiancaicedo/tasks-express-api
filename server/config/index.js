require('dotenv').config();

const config = {
  port: process.env.PORT,
  dataFilePath: process.env.DATA_FILE_PATH,
  dbConfig: {
    protocol: process.env.DB_PROTOCOL,
    url: process.env.DB_URL,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
};

module.exports = config;
