module.exports = (server) => {

    'use strict';

    const isMongooseObject = require('../helpers/is-mongoose-object');

    server.get('/', (request, response) => {

        // list all the posts
        response.send('list posts');
    });

    server.post('/', (request, response) => {

        // create a post
        response.send('create post');
    });

    server.patch('/:id', (request, response) => {

        // update a post
        response.send('update post: ' + request.params.id);
    });

    server.del('/:id', (request, response) => {

        // delete a post
        response.send('delete post: ' + request.params.id);
    });

    server.get('/:term', (request, response) => {

        // shows a specific post
        if(isMongooseObject(request.params.term)) {
            // show a post by id
        } else {
            // show a post by title or if it appears in the body
        }

        response.send('get a post: ' + request.params.term);
    });

};
