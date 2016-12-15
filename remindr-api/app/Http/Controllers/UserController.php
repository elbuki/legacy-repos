<?php

namespace App\Http\Controllers;

use App\User;

use App\Mail\ActivationCode;
use Illuminate\Support\Facades\Mail;

use Illuminate\Http\Request;

class UserController extends Controller
{

	public function index(Request $request) {

		$user_type = $request->user_type;
		$search_term = $request->search_term;

		$data = User::where('user_type', $user_type);

		if(!is_null($search_term)) {

			$data = $data->where('email', $search_term);
		}

		$data = $data->get();

		return response()->json($data);
	}

    public function store(Request $request)
    {

		$user = new User;

		$user->id_number = $request->id_number;
		$user->name = $request->name;
		$user->email = $request->email;
		$user->password = bcrypt($request->password);

		$user->activation_code = strtolower(str_random(20));
		$user->user_type = $this->get_user_type($user->email);

		$user->setting()->create([
			'dont_alert_admin' => false,
		]);

		if(!is_numeric($user->user_type)) {

			return response()->json($user->user_type, 400);
		}

		$user->save();

		Mail::to($user->email)->send(new ActivationCode($user));

		return response()->json([], 201);
    }

	public function update(Request $request, $id) {

		$user = User::find($id);

		$setting = [
			'dont_alert_admin' => $request->dont_alert_admin,
		];

		$user->setting()->save($setting);
	}

	public function activate(Request $request) {

		$user = User::where('activation_code', $request->code)->first();

		if($user) {

			$user->activation_code = null;
			$user->save();

			return response('Account verified', 200);
		}

		return response('Account not found', 422);
	}

	private function get_user_type($email) {

        if(preg_match_all("/@est.utn.ac.cr|@utn.ac.cr/", $email)) {

            return preg_match_all("/@est.utn.ac.cr/", $email) ? 3 : 2;
        } else {

            return [
                'error' => 'Invalid email',
                'message' => 'The email that you\'re trying to log with is invalid'
            ];
        }
    }
}
