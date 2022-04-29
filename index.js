const http = require('http');
const app = require('./server');
const config = require('./server/config');

const { port } = config;

const httpServer = http.createServer(app);

httpServer.listen(port, () => {
  console.log(`El servidor se está ejecutando en el puerto ${port}`);
});
