<?php

namespace App\Http\Controllers;

use App\ClassEvent;
use App\Event;
use App\EventVariation;
use App\Classes;
use Illuminate\Http\Request;
use App\User;

class EventController extends Controller
{

	private $DATE_FORMAT = 'Y-m-d h:i:s';

    public function __construct()
    {

        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        $eventu = Event::where('class_id', null)->get();
        $user = User::find(($request->current_user->id));
        $events = Event::where('created_by', $user->id)->get();

        $eventsclass = array();
        $class_user = $user->classes()->get();
        foreach ($class_user as $class) {
            $clas = Classes::find($class->class_id);
            $clas->events = ClassEvent::where('class_id', $clas->id)->get();
            foreach ($clas->events as $event) {
                array_push($eventsclass, Event::find($event->event_id));
            }
        }
        $events = $this->getEventVariation($events);
        $eventsclass = $this->getEventVariation($eventsclass);
        $eventu = $this->getEventVariation($eventu);
        $events->put('classevents', $eventsclass);
        return response()->json(['status' => 'ok', 'data' => $events, $eventu], 200);
    }

    public function getEventVariation($events)
    {
        foreach ($events as $event) {
            $event->eventsVariation = EventVariation::where('parent_event_id', $event->id)->get();
        }
        return $events;
    }

    public function store(Request $request)
    {
         if (!$request->input('title') || !$request->input('datetime') ||
		 	 !$request->input('created_by')) {

            return response()->json(['errors' => array(['code' => 422, 'message' => 'Faltan campos por rellenar'])], 422);
        }

        $newEvent = Event::create($request->all());
        $eventVariation = null;
        if ($request->input('parent_event_id')) {
            $eventVariation = EventVariation::create(['parent_event_id' => $request->input('parent_event_id'), 'child_event_id' =>
                $newEvent->id]);
        }

        return response()->json(['data' => $newEvent, $eventVariation], 201);
    }

    /**
     * Display the specified user.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $event = Event::find($id);

        if (!$event) {

            return response()->json(['errors' => array(['code' => 404, 'message' => 'Evento no encontrado'])], 404);
        }
        $event->eventsVariation = EventVariation::where('parent_event_id', $event->id)->get();
        return response()->json(['status' => 'ok', 'data' => $event], 200);

    }

    public function edit($id)
    {
        //
    }

    /**
     * Update the specified user in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $event = Event::find($id);

        if (!$event) {

            return response()->json(['errors' => array(['code' => 404, 'message' => 'Evento no encontrado'])], 404);
        } else {

            $title = $request->input('title');
            $datetime = $request->input('datetime');
            $description = $request->input('description');
            $exclude_weekends = $request->input('exclude_weekends');
            $active = $request->input('active');
            $private = $request->input('private');
            $class_id = $request->input('class_id');
            $created_by = $request->input('created_by');

            if (!$title || !$datetime || !$description || !$created_by) {

                return response()->json(['errors' => array(['code' => 422, 'message' => 'Faltan campos por rellenar'])], 422);
            }

			if($title) {

				$event->title = $title;
			}

			if($datetime) {

				$event->datetime = $datetime;
			}

			if($description) {

				$event->description = $description;
			}

			if($exclude_weekends) {

				$event->exclude_weekends = $exclude_weekends;
			}

			if($active) {

				$event->active = $active;
			}

			if($private) {

				$event->private = $private;
			}

			if($class_id) {

				$event->class_id = $class_id;
			}

			if($created_by) {

				$event->created_by = $created_by;
			}

            $event->save();
            return response()->json(['status' => 'ok', 'data' => $event], 200);
        }
    }

    /**
     * Remove the specified user from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

        $event = Event::find($id);

        if (!$event) {

            return response()->json(['errors' => array(['code' => 404, 'message' => 'Evento no encontrado'])], 404);
        }

        $classes = $event->classes;
        $event->eventsParent = EventVariation::where('parent_event_id', $event->id)->get();
        $event->eventsChild = EventVariation::where('child_event_id', $event->id)->get();
        if (sizeof($classes) > 0) {

            return response()->json(['code' => 409, 'message' => 'Este evento no puede ser eliminado.'], 409);
        }

        $event->delete();

        return response()->json(['code' => 204, 'message' => 'Evento eliminado correctamente.'], 204);

    }
}
