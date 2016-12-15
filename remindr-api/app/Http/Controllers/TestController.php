<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TestController extends Controller
{

    public function __construct()
    {

        /*
        $this->middleware('auth'); # Runs auth middleware on every route.
        $this->middleware('auth', 'can:teacher'); # Runs can middleware as teacher on every route.
        $this->middleware('auth', 'can:admin'); # Runs can middleware as admin on every route.
        $this->middleware('auth')->only('function_name'); # Runs auth middleware only on the function_name function.
        $this->middleware('auth')->except('function_name'); # Runs auth middleware in every function except the function_name function.
         */
        $this->middleware('auth')->except('teacher');
    }

    public function index(Request $request/* This parameter is needed to access the current_user. */)
    {

        dd($request->current_user->toArray());
    }

    public function teacher()
    {

        dd('You are a teacher!');
    }

    public function admin()
    {

        dd('You\'re an admin!');
    }
}
