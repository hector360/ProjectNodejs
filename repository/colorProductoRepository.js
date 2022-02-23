const ColorProducto = require("../database/models/ColorProduct");

const boom = require("@hapi/boom");

exports.create = async (data) => {
  return new Promise((resolve, reject) => {
    ColorProducto.create({
      color: data.color,
      status: 1,
    }).then((color) => {
      color ? resolve(color) : resolve(boom.badData());
    });
  });
};

exports.get = async () => {
  return new Promise((resolve, reject) => {
    ColorProducto.findAll().then((color) => {
      color ? resolve(color) : resolve(boom.badData());
    });
  });
};
