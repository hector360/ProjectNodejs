const { Model, DataTypes } = require("sequelize");
const ParrafoPost = require("./ParrafoPost");
const SubPosts = require("./SubPosts");

const sequelize = require("../db");

class Posts extends Model {}
Posts.init(
  {
    titulo: DataTypes.STRING,
    urlImagenPost: DataTypes.STRING,
    slug: DataTypes.STRING,
    idTag: DataTypes.INTEGER,
    id_producto: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "posts",
  }
);

Posts.hasMany(ParrafoPost, { foreignKey: "idPost" });
ParrafoPost.belongsTo(Posts, { foreignKey: "idPost" });

Posts.hasMany(SubPosts, { foreignKey: "idPost" });
SubPosts.belongsTo(Posts, { foreignKey: "idPost" });

module.exports = Posts;
