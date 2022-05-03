const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');
const config = require('./../../../config');

const { dataFilePath } = config;
let tasks = [];

exports.all = async (req, res, next) => {
  try {
    await loadDataAsJSON();
    res.json(tasks);
  } catch (error) {
    next(Object.assign(error, { message: 'Error reading data file' }));
  }
};

exports.create = async (req, res, next) => {
  const { body } = req;
  const { description = '', author = '' } = body;

  const task = {
    id: uuidv4(),
    description,
    author,
    created: new Date().toUTCString(),
    updated: '',
  };

  try {
    await loadDataAsJSON();
    tasks.push(task);
    await saveDataAsJSON();
    res.json(task);
  } catch (error) {
    next(Object.assign(error, { message: 'Error reading data file' }));
  }
};

exports.findById = async (req, res, next) => {
  const { params = {} } = req;
  const { id = '' } = params;

  try {
    await loadDataAsJSON();
  } catch (error) {
    next(Object.assign(error, { message: 'Error reading data file' }));
  }
  const task = tasks.find((t) => t.id === id);

  if (task) {
    req.middleWare = { ...req.middleWare, taskFound: task };
    next();
  } else {
    next({
      message: `Task with id '${id}' not found.`,
      statusCode: 404,
    });
  }
};

exports.read = async (req, res, next) => {
  const { middleWare = {} } = req;
  const { taskFound } = middleWare;

  if (taskFound) {
    res.json(taskFound);
  }
};

exports.update = async (req, res, next) => {
  const { body = {} } = req;
  const { middleWare = {} } = req;
  const { taskFound } = middleWare;

  if (taskFound) {
    const task = {
      ...taskFound,
      ...body,
      id: taskFound.id,
      updated: new Date().toUTCString(),
    };
    tasks[tasks.findIndex((x) => x.id === task.id)] = { ...task };

    try {
      await saveDataAsJSON();
      res.json(task);
    } catch (error) {
      next(Object.assign(error, { message: 'Error reading data file' }));
    }
  }
};

exports.delete = async (req, res, next) => {
  const { params = {} } = req;
  const { id = '' } = params;

  try {
    await loadDataAsJSON();
  } catch (error) {
    next(Object.assign(error, { message: 'Error reading data file' }));
  }
  const taskIndex = tasks.findIndex((x) => x.id === id);

  if (taskIndex >= 0) {
    const task = tasks[taskIndex];
    tasks.splice(taskIndex, 1);

    try {
      await saveDataAsJSON();
      res.json(task);
    } catch (error) {
      next(Object.assign(error, { message: 'Error reading data file' }));
    }
  } else {
    next({
      message: `Task with id '${id}' not found.`,
      statusCode: 404,
    });
  }
};

const loadDataAsJSON = async () => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    tasks = JSON.parse(data);
  } catch (error) {
    throw Object.assign(
      new Error("Data file path doesn't exist", {
        statusCode: 500,
      })
    );
  }
};

const saveDataAsJSON = async () => {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(tasks, null, 4));
  } catch (error) {
    throw Object.assign(
      new Error("Data file path doesn't exist", {
        statusCode: 500,
      })
    );
  }
};
