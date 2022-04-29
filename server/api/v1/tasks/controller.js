const { v4: uuidv4 } = require('uuid');

const tasks = [];

exports.all = (req, res, next) => {
  res.json(tasks);
};

exports.create = (req, res, next) => {
  const { body } = req;
  const { description = '', author = '' } = body;

  const task = {
    id: uuidv4(),
    description,
    author,
    created: new Date().toUTCString(),
    updated: '',
  };

  tasks.push(task);

  res.json(task);
};

exports.read = (req, res, next) => {
  const { params = {} } = req;
  const { id = '' } = params;

  const task = tasks.find((t) => t.id === id);

  if (task === undefined) {
    return next({
      message: `Task with id '${id}' not found.`,
      statusCode: 404,
    });
  }

  res.json(task);
};

exports.update = (req, res, next) => {
  const { params = {}, body = {} } = req;
  const { id = '' } = params;
  const { description = '', author = '' } = body;

  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex < 0) {
    return next({
      message: `Task with id '${id}' not found.`,
      statusCode: 404,
    });
  }
  const task = tasks[taskIndex];

  task.updated = new Date().toUTCString();
  task.description = description;
  task.author = author;

  res.json(task);
};

exports.delete = (req, res, next) => {
  const { params = {} } = req;
  const { id = '' } = params;

  const taskIndex = tasks.findIndex((x) => x.id === id);

  if (taskIndex < 0) {
    return next({
      message: `Task with id '${id}' not found.`,
      statusCode: 404,
    });
  }

  const task = tasks[taskIndex];
  tasks.splice(taskIndex, 1);

  res.json(task);
};
