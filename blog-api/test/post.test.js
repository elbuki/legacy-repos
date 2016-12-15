'use strict';

const test = require('tape');

const Post = require('../models/post');

let postWithoutTitle = {
    body: 'hello, this is a schema test and it should\'t work'
};

let postWithoutBody = {
    title: 'Test'
};

let postWithLargeTitle = {
    title: 'so, this is another test, it should fail because this title has too many characters',
    body: 'wait, does it fail?'
};

let postWithAFewCharacters = {
    title: 'Test post',
    body: 'this is a test'
};

let postWithATagThatHasFewCharacters = {
    title: 'Test',
    body: 'hello, this is a schema test and it should work',
    tags: ['abc', 'programming', 'testing']
};

let postWithATagThatHasTooMuchCharacters = {
    title: 'Test',
    body: 'hello, this is a schema test and it should work',
    tags: ['abcefg', 'programminginjavascriptandnodejs', 'testing']
};

let validPost = {
    title: 'this is a test',
    body: 'hello, this is a schema test and it should work'
};

test('post validations', (t) => {

    new Post(postWithoutTitle).validate((error) => {
        t.equal(!!error, true, 'where\'s the title?');
    });

    new Post(postWithoutBody).validate((error) => {
        t.equal(!!error, true, '... and the body?');
    });

    new Post(postWithLargeTitle).validate((error) => {
        t.equal(!!error, true, 'post\'s title shouldn\'t have too many characters');
    });

    new Post(postWithAFewCharacters).validate((error) => {
        t.equal(!!error, true, 'post\'s body shouldn\'t have few characters');
    });

    new Post(postWithATagThatHasFewCharacters).validate((error) => {
        t.equal(!!error, true, 'post tags should\'t have few characters');
    });

    new Post(postWithATagThatHasTooMuchCharacters).validate((error) => {
        t.equal(!!error, true, 'wait, it shouldn\'t have too much characters for a tag');
    });

    new Post(validPost).validate((error) => {
        t.equal(!!error, false, 'ok, this one is good to go!');
    });

    t.end();
});
