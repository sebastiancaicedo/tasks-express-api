require('dotenv').config();

const config = {
  port: process.env.PORT,
  dataFilePath: process.env.DATA_FILE_PATH,
};

module.exports = config;
