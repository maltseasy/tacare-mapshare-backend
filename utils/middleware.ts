import Joi from "joi";
import * as config from "../config";
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
import User from "../models/user";

// export const updateProfileSchema = (req, res, next) => {
//   const schema = Joi.object({
//     email: Joi.string().email().required(),
//     firstName: Joi.string().required(),

//   });
//   validateRequest(req, next, schema);
// };

export const registerSchema = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    userType: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  validateRequest(req, next, schema);
};

export const loginSchema = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  validateRequest(req, next, schema);
};

const validateRequest = (req, next, schema) => {
  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true, // remove unknown props
  };
  const { error, value } = schema.validate(req.body, options);
  if (error) {
    next(createError(400, `Validation Error`));
  } else {
    req.body = value;
    next();
  }
};

export const requestLogger = (req, res, next) => {
  console.log("Method:", req.method);
  console.log("Path:  ", req.path);
  console.log("Header:  ", req.header);
  console.log("Body:  ", req.body);
  console.log("---");

  next();
};

export const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

export const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    next(error);
  }
  res.status(error.status || 500);
  res.json({
    status: error.status,
    message: error.message,
  });
};

export const tokenAuthenticator = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (token == null) return res.status(400).send("Missing token");

  jwt.verify(token, config.JWT_KEY, async (err, key) => {
    if (err) return res.status(403).send("Invalid token");

    req.uid = key.uid;

    next();
  });
};
