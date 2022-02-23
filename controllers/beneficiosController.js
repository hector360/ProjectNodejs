const BeneficiosRepository = require("../repository/beneficiosRepository");
const boom = require("@hapi/boom");

exports.getBenefits = async (req, res, next) => {
  try {
    const benefits = await BeneficiosRepository.getBeneficts({
      id_membresia: req.params.membresia,
    });

    if (benefits.isBoom) next(benefits);

    res.status(200).json({
      status: res.statusCode,
      messgae: benefits,
    });
  } catch (err) {
    next(boom.internal(err));
  }
};

exports.setBenefitsService = async (req, res, next) => {
  try {
    const benefits = await BeneficiosRepository.setBenefict({
      id_membresia: req.body.id_membresia,
      beneficio: req.body.beneficio,
    });

    if (benefits.isBoom) next(benefits);

    res.status(200).json({
      status: res.statusCode,
      messgae: benefits,
    });
  } catch (err) {
    next(boom.internal(err));
  }
};
