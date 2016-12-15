<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\User;

use Illuminate\Support\Facades\Hash;

use \League\OAuth2\Client\Provider\GenericProvider as AuthProvider;
use \GuzzleHttp\Client as Curl;

class SessionController extends Controller
{

    private $authority_url = "https://login.microsoftonline.com";
    private $authorize_url = "/common/oauth2/v2.0/authorize";
    private $tokenUrl = "/common/oauth2/v2.0/token";
    private $scopes = "openid profile";

    private $grant_type = "authorization_code";

    private $microsoft_id = null;
    private $microsoft_secret = null;
    private $microsoft_callback = null;

    public function __construct() {

        $this->microsoft_id = env('MICROSOFT_ID');
        $this->microsoft_secret = env('MICROSOFT_SECRET');
        $this->microsoft_callback = env('MICROSOFT_CALLBACK');
    }

    public function authenticate(Request $request) {

        $access_token = $this->getProviderArray()
                        ->getAccessToken('authorization_code', [
                            'code' => $request->code
                        ]);

        $result = $this->register($this->getUserInfo($access_token->getToken()));

        return response()->json($result, 200);
    }

    public function login() {

        return redirect($this->getProviderArray()->getAuthorizationUrl());
    }

	public function local_login(Request $request) {

		$state = 422;

		$result = null;

		$user = User::where('email', $request->email)->first();

		if(is_null($user)) {

			$password = false;
		} else {

			$password = Hash::check($request->password, $user->password);
		}

		if($user && $password) {

			if($user->activation_code) {

				$state = 412;

				$result = [
					'error' => 'Account not verified'
				];
			} else {

				$token = strtolower(str_random(10));

				$user->token = $token;
				$user->save();

				$state = 200;

				$result = [
					'token' => $token,
					'user' => $user,
				];
			}
		} else {

			$result = [
				'error' => 'Login invalid'
			];
		}

		return response()->json($result, $state);
	}

	public function logout(Request $request) {

		$header = $request->header('Authorization');

		$user = User::where('token', $header)->first();

		if($user) {

			$user->token = null;
			$user->save();
		}

		return response('Logged out!', 204);
	}

    private function getUserInfo($token) {

        $api_url = 'https://graph.microsoft.com/v1.0/me/';

        $response = (new Curl())->request('GET', $api_url, [
            'headers' => [
                'Authorization' => 'Bearer ' . $token,
                'Content-Type' => 'application/json'
            ]
        ]);

        $user = json_decode($response->getBody()->getContents());

        return $user;
    }

    private function getProviderArray() {

        $parameters = [
            'clientId' => $this->microsoft_id,
            'clientSecret' => $this->microsoft_secret,
            'redirectUri' => $this->microsoft_callback,
            'urlAuthorize' => $this->authority_url . $this->authorize_url,
            'urlAccessToken' => $this->authority_url . $this->tokenUrl,
            'urlResourceOwnerDetails' => '',
            'scopes' => 'User.Read'
        ];

        return new AuthProvider($parameters);
    }

    private function register($user_data) {

        $user = null;

        $registered_user = User::where('email', $user_data->mail);

        $token = strtolower(str_random(10));

        $user_type = $this->get_user_type($user_data->mail);

        if(!is_numeric($user_type)) {

            return response()->json($user_type, 400);
        }

        if(!$registered_user->count()) {

            $user = new User;

            $user->id_number = $user_data->officeLocation;
            $user->email = $user_data->mail;
            $user->password = bcrypt($user_data->id . $user_data->mail);
            $user->name = $user_data->displayName;
            $user->user_type = $user_type;
        } else {

            $user = $registered_user->firstOrFail();
        }

        $user->token = $token;
        $user->token_expires_at = date('Y-m-d H:i:s', strtotime('+30 minutes'));

        $user->save();

        return [
            'token' => $token
        ];
    }

    private function get_user_type($email) {

        if(preg_match_all("/@est.utn.ac.cr|@utn.ac.cr/", $email)) {

            return preg_match_all("/@est.utn.ac.cr/", $email) ? 2 : 3;
        } else {

            return [
                'error' => 'Invalid email',
                'message' => 'The email that you\'re trying to log with is invalid'
            ];
        }
    }
}
