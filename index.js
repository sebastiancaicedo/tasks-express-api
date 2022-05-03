const http = require('http');
const app = require('./server');
const config = require('./server/config');
const dbhanlder = require('./server/dbhandler');

const { port, dbConfig } = config;

// Connect to db
dbhanlder.connect(dbConfig);

const httpServer = http.createServer(app);

httpServer.listen(port, () => {
  console.log(`El servidor se está ejecutando en el puerto ${port}`);
});
