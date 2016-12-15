
'use strict';

module.exports = function(express) {

    const router = express.Router();

    let Survey = require('./survey');

    router.get('/questions', (request, response) => {

        Survey
            .find()
            .limit(1)
            .then((survey) => {
                return response.json(survey);
            })
            .catch((error) => {
                return response.json(error);
            });
    });

    router.put('/questions', (request, response) => {

        let query = {
            _id: request.body._id
        };

        let options = {
            upsert: true
        };

        let data = {
            questions: request.body.questions
        };

        Survey
            .findOneAndUpdate(query, data, options)
            .then((survey) => {
                
                return response.sendStatus(200);
            })
            .catch((error) => {
                console.log(error, 'error');
            });

    });

    return router;
};
