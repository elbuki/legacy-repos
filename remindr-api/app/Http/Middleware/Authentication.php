<?php

namespace App\Http\Middleware;

use Closure;

use App\User;

class Authentication
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {

        $response = null;
        $token = $request->header('Authorization');

        if(!$token) {

            $response = [
                'error' => 'Invalid token',
                'message' => 'Token missing'
            ];
        } else {

            $user = User::where('token', $token);

            if($user->count()) {

                $user = $user->first();

				$request->current_user = $user;

                $user->save();
            } else {

                $response = [
                    'error' => 'Not authenticated',
                    'message' => 'This token is not registered for an user'
                ];
            }
        }

        return $response === null ? $next($request) :
                                    response()->json($response, 401);
    }
}
