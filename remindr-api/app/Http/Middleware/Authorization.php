<?php

namespace App\Http\Middleware;

use Closure;

class Authorization
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, $user_type)
    {

        $response = [
            'error' => 'Not enough permissions',
            'message' => 'This user cannot enter this area',
        ];

        $type = $request->current_user->user_type;

        $authorized = $this->check_permission($user_type, $type);

        return $authorized ? $next($request) : response()->json($response, 401);
    }

    private function check_permission($should, $has) {

        switch($should) {
            case "admin":
                $should = 1;
            break;
            case "teacher":
                $should = 2;
            break;
            default:
                $should = false;
        }

        return $should >= $has && $should;
    }
}
