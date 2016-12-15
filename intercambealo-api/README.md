# Intercambealo Web API

This is a Web RESTful API responsible for serving data using the intercambealo database. First project of the first quarter, 2016, UTN.

## Dependencies

### Hard dependencies

This project requires an installation of `mysql`, it's based on Ruby on Rails 4.2.5.2. Refer your operating system documentation in order to install it.

Also this project requires a database created with the name `intercambialo_development`  which stores all the information that the API is going to interact.

In order to consume this API, you have to use `curl` or `Postman`. In the root of this repository, it has a `json.postman_collection` file that contains all the endpoints.

### Gem dependencies

- `rails`
- `rails-api`
- `spring`
- `mysql2`

A `bundle install` will do the trick.

## Usage

You can browse this repository to see the controllers to know what every action does, pretty straightforward.

All the endpoints for this API are listed in this [document (in spanish)](https://docs.google.com/document/d/1GmOaztoM78glrWnPtS5rfe6Lm7uoa0YfyzBNjnJjqUM/edit#heading=h.ahogvccw8p3x)

## Assumptions (to the teacher)

- This project is 100% based on the document given by the teacher.
- When a user gets deleted, all their sessions are deleted too.
- User can have more than one session opened. (more than one token registered)