<?php

namespace App\Http\Controllers;

use App\Classes;
use Illuminate\Http\Request;
use App\User;
use Auth;

class ClassController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');

    }

    public function index(Request $request)
    {

        $classes = Classes::all();
       return response()->json(['status' => 'ok', 'data' => $classes], 200);
    }

    /**
     * Store a newly created user in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = ($request->current_user->user_type);

        if ($user == 1 || $user == 2){

            if (!$request->input('name') || !$request->input('description') || !$request->input('classroom') ||
             !$request->input('teacher_id') || !$request->input('grade_table')){

             return response()->json(['errors' => array(['code' => 422, 'message' => 'Faltan campos por rellenar'])], 422);
         }

            $newClass = Classes::create($request->all());

            return response()->json(['data' => $newClass], 201);
        }
        return response()->json(['errors' => array(['code' => 422, 'message' => 'No tienes permisos suficientes para crear una clase'
        ])], 422);
    }


    /**
     * Display the specified user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    public function show($id)
    {
      $class = Classes::find($id);

      if (!$class) {

          return response()->json(['errors' => array(['code' => 404, 'message' => 'La clase no existe'])], 404);
      }
      return response()->json(['status' => 'ok', 'data' => $class], 200);

    }

    /**
     * Show the form for editing the specified user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified user in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
      $class = Classes::find($id);

      if (!$class) {

          return response()->json(['errors' => array(['code' => 404, 'message' => 'Clase no encontrada'])], 404);
      } else {

          $name = $request->input('name');
          $description = $request->input('description');
          $classroom= $request->input('classroom');
          $teacher_id = $request->input('teacher_id');
          $grade_table = $request->input('grade_table');
            dd($name);
          if (!$name || !$description || !$classroom || !$teacher_id || !$grade_table) {

              return response()->json(['errors' => array(['code' => 422, 'message' => 'Faltan campos por rellenar'])], 422);
          }

          $class->name = $name;
          $class->description = $description;
          $class->classroom = $classroom;
          $class->teacher_id = $teacher_id;
          $class->grade_table= $grade_table;

          $class->save();
          return response()->json(['status' => 'ok', 'data' => $class], 200);
      }
    }

    /**
     * Remove the specified user from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id, Request $request)
    {
        $class = Classes::find($id);
        $user = ($request->current_user->user_type);
        if ($user == 1 || $user == 2) {

            if (!$class) {

                return response()->json(['errors' => array(['code' => 404, 'message' => 'Clase no encontrada'])], 404);
            }
            $class->delete();
            return response()->json(['code' => 204, 'message' => 'Clase eliminada correctamente.'], 204);

        }
        return response()->json(['errors' => array(['code' => 422, 'message' => 'No tienes permisos suficientes para eliminar una clase'
        ])], 422);
    }
}
