const Posts = require('../database/models/Posts');

function getPostsEspectaculos(){
    return Posts.findAll({
        where: {
            idTag: 16
        }
    }).then(posts => {
        console.log(posts)
        return posts;
    })
}

module.exports = {
    getPostsEspectaculos
}