'use strict';

module.exports = function indexRoutesInitializer(app) {
    
    app.get('/', function handleIndex(request, response) {
        
        response.send('Welcome to the remindr API');
    });
};
