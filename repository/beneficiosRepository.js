const Beneficios = require("../database/models/Beneficios");
const boom = require("@hapi/boom");

exports.getBeneficts = async ({ id_membresia }) => {
  return new Promise(async (resolve, reject) => {
    const beneficios = await Beneficios.findAll({
      where: {
        id_membresia,
      },
    });

    beneficios ? resolve(beneficios) : resolve(boom.badData());
  });
};

exports.setBenefict = async ({ id_membresia, beneficio }) => {
  return new Promise(async (resolve, reject) => {
    const beneficios = await Beneficios.create({
      id_membresia,
      beneficio,
      status: 1,
    });

    beneficios ? resolve(beneficios) : resolve(boom.badData());
  });
};
