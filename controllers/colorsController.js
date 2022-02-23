const ColorProductoRepository = require("../repository/colorProductoRepository");

const boom = require("@hapi/boom");

exports.create = async (req, res, next) => {
  try {
    const color = await ColorProductoRepository.create(req.body);

    if (color.isBoom) next(color);

    res.status(200).json({
      status: res.statusCode,
      message: {
        label: "Color creado correctamente",
        color,
      },
    });
  } catch (err) {
    next(boom.internal(err));
  }
};

exports.get = async (req, res, next) => {
  try {
    const color = await ColorProductoRepository.get();

    if (color.isBoom) next(color);

    res.status(200).json({
      status: res.statusCode,
      message: color,
    });
  } catch (err) {
    next(boom.internal(err));
  }
};
