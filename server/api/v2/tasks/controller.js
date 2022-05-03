const { fields, Model, references } = require('./model');

const { paginationParseParams, sortParseParams } = require('./../../../utils');

exports.all = async (req, res, next) => {
  const { query = {} } = req;
  const { limit, skip } = paginationParseParams(query);
  const { sortBy, direction } = sortParseParams(query, fields);
  try {
    const populateFields = Object.getOwnPropertyNames(references).join(' ');

    const [total = 0, data = []] = await Promise.all([
      Model.countDocuments(),
      Model.find({})
        .skip(skip)
        .limit(limit)
        .sort({
          [sortBy]: direction,
        })
        .populate(populateFields)
        .exec(),
    ]);

    res.json({
      data,
      meta: {
        total,
        limit,
        skip,
        total,
        sortBy,
        direction,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  const { body } = req;
  const { description = '', author = '' } = body;

  const task = {
    description,
    author,
  };

  const document = new Model(task);

  try {
    const populateFields = Object.getOwnPropertyNames(references).join(' ');

    const data = await document.save();
    data.populate(populateFields);

    res.status(201);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.findById = async (req, res, next) => {
  const { params = {} } = req;
  const { id } = params;

  const populateFields = Object.getOwnPropertyNames(references).join(' ');
  try {
    const data = await Model.findById(id).populate(populateFields).exec();

    if (data) {
      req.middleWare = { ...req.middleWare, taskFound: data };
      next();
    } else {
      next({
        statusCode: 404,
        message: 'Document not found',
      });
    }
  } catch (error) {
    next(error);
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

  const safeFields = Object.getOwnPropertyNames(fields).reduce((obj, key) => {
    if (key in fields) {
      obj[key] = body[key];
    }
    return obj;
  }, {});

  if (taskFound) {
    const taskUpdated = {
      ...safeFields,
    };

    try {
      const populateFields = Object.getOwnPropertyNames(references).join(' ');
      const data = await Model.findByIdAndUpdate(taskFound.id, taskUpdated, {
        new: true,
        runValidators: true,
      }).populate(populateFields);
      res.json({
        data,
      });
    } catch (error) {
      next(error);
    }
  }
};

exports.delete = async (req, res, next) => {
  const { middleWare = {} } = req;
  const { taskFound } = middleWare;

  try {
    const populateFields = Object.getOwnPropertyNames(references).join(' ');
    const data = await Model.findByIdAndDelete(taskFound.id).populate(
      populateFields
    );
    res.json({
      data,
    });
  } catch (error) {
    next(error);
  }
};
