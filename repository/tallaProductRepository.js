const TallaProducto = require("../database/models/TallaProduct");

const boom = require("@hapi/boom");

exports.create = async ({ data }) => {
  return new Promise((resolve, reject) => {
    TallaProducto.create({
      talla: data.talla,
      status: 1,
    }).then((talla) => {
      talla ? resolve(talla) : resolve(boom.badData());
    });
  });
};

exports.get = async () => {
  return new Promise((resolve, reject) => {
    TallaProducto.findAll().then((talla) => {
      talla ? resolve(talla) : resolve(boom.badData());
    });
  });
};
