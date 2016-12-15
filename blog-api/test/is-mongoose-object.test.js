'use strict';

const test = require('tape');

const isMongooseObject = require('../helpers/is-mongoose-object');

test('test if something is a mongoose object id', (t) => {

    t.plan(8);
    t.equal(isMongooseObject('571e470fc4cb041120cb0f93'), true, 'should be an objectId');
    t.equal(isMongooseObject('1'), false, 'shouldn\'t be an objectId');
    t.equal(isMongooseObject('56f95836482aabf57948967b'), true, 'should be an objectId');
    t.equal(isMongooseObject('57178cb640d927710d7dd94'), false, 'shouldn\'t be an objectId');
    t.equal(isMongooseObject('56f9582b482aabf57948967a'), true, 'should be an objectId');
    t.equal(isMongooseObject('6f95836482aabf57948967b'), false, 'shouldn\'t be an objectId');
    t.equal(isMongooseObject('56f9582b482aabf57948967a'), true, 'should be an objectId');
    t.equal(isMongooseObject('false'), false, 'shouldn\'t be an objectId');
});
