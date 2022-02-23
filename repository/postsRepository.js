const Posts = require("../database/models/Posts");
const ParrafoPost = require("../database/models/ParrafoPost");
const SubPosts = require("../database/models/SubPosts");
const ParrafoSubPosts = require("../database/models/ParrafoSubPosts");
const boom = require("@hapi/boom");

exports.getPostBySlug = async (slug) => {
  return new Promise(async (resolve, reject) => {
    await Posts.findOne({
      where: {
        slug,
      },
      attributes: ["titulo", "urlImagenPost", "slug"],
      include: [
        {
          model: ParrafoPost,
          attributes: ["parrafo"],
          order: [["createdAt", "DESC"]],
        },
        {
          model: SubPosts,
          attributes: ["subtitulo", "urlImagenPost"],
          include: {
            model: ParrafoSubPosts,
            attributes: ["parrafo"],
            order: [["createdAt", "DESC"]],
          },
        },
      ],
    }).then((post) => {
      post ? resolve(post) : resolve(boom.badData());
    });
  });
};
