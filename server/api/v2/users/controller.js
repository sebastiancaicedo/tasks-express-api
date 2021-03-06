const { fields, Model } = require('./model');
const { paginationParseParams, sortParseParams } = require('./../../../utils');

exports.all = async (req, res, next) => {
  try {
    const { query = {} } = req;
    const { limit, skip } = paginationParseParams(query);
    const { sortBy, direction } = sortParseParams(query, fields);

    const [total = 0, data = []] = await Promise.all([
      Model.countDocuments(),
      Model.find({})
        .skip(skip)
        .limit(limit)
        .sort({
          [sortBy]: direction,
        })
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
  const { firstName = '', lastName = '', email = '' } = body;

  const user = {
    firstName,
    lastName,
    email,
  };

  const document = new Model(user);

  try {
    const data = await document.save();

    res.status(201);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.findById = async (req, res, next) => {
  const { params = {} } = req;
  const { id } = params;

  try {
    const data = await Model.findById(id).exec();

    if (data) {
      req.middleWare = { ...req.middleWare, userFound: data };
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
  const { userFound } = middleWare;

  if (userFound) {
    res.json(userFound);
  }
};

exports.update = async (req, res, next) => {
  const { body = {} } = req;
  const { middleWare = {} } = req;
  const { userFound } = middleWare;

  const safeFields = Object.getOwnPropertyNames(fields).reduce((obj, key) => {
    if (key in fields) {
      obj[key] = body[key];
    }
    return obj;
  }, {});
  if (userFound) {
    const userUpdated = {
      ...safeFields,
    };

    try {
      const data = await Model.findByIdAndUpdate(userFound.id, userUpdated, {
        new: true,
        runValidators: true,
      });
      res.json({
        data,
      });
    } catch (error) {
      next(error);
    }
  }
};

exports.activation = async (req, res, next) => {
  const { body = {} } = req;
  const { middleWare = {} } = req;
  const { userFound } = middleWare;

  if (userFound) {
    const { enabled = userFound.enabled } = body;
    if (enabled === userFound.enabled) {
      return res.json({
        userFound,
      });
    }
    const userUpdated = {
      enabled,
    };

    try {
      const data = await Model.findByIdAndUpdate(userFound.id, userUpdated, {
        new: true,
      });
      res.json({
        data,
      });
    } catch (error) {
      next(error);
    }
  }
};
