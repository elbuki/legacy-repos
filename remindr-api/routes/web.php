<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
 */

# Middleware examples
Route::get('/test', 'TestController@index')->middleware('auth');
// Route::get('/teacher', 'TestController@teacher')->middleware('auth', 'can:teacher');
// Route::get('/admin', 'TestController@admin')->middleware('auth', 'can:admin');

Route::get('/authenticate', 'SessionController@authenticate');
Route::get('/login', 'SessionController@login');
Route::post('/local_login', 'SessionController@local_login');
Route::post('/logout', 'SessionController@logout');
Route::get('/activate/{code}', 'UserController@activate');
Route::resource('/user', 'UserController');

// Route::get('/template', function() {
//
// 	return view('activation');
// });
Route::resource('/event', 'EventController');

Route::resource('/class', 'ClassController');
