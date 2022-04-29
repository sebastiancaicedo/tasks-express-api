const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const config = require('./../../../config');

const { dataFilePath } = config;
let tasks = [];

exports.all = (req, res, next) => {
  loadDataAsJSON();
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

  loadDataAsJSON();
  tasks.push(task);
  saveDataAsJSON();

  res.json(task);
};

exports.read = (req, res, next) => {
  const { params = {} } = req;
  const { id = '' } = params;

  loadDataAsJSON();
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

  loadDataAsJSON();
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

  saveDataAsJSON();
  res.json(task);
};

exports.delete = (req, res, next) => {
  const { params = {} } = req;
  const { id = '' } = params;

  loadDataAsJSON();
  const taskIndex = tasks.findIndex((x) => x.id === id);

  if (taskIndex < 0) {
    return next({
      message: `Task with id '${id}' not found.`,
      statusCode: 404,
    });
  }

  const task = tasks[taskIndex];
  tasks.splice(taskIndex, 1);

  saveDataAsJSON();
  res.json(task);
};

const loadDataAsJSON = () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    tasks = JSON.parse(data);
  } catch (error) {
    tasks = [];
  }
};

const saveDataAsJSON = () => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(tasks, null, 4));
  } catch (error) {
    console.log(error);
  }
};
