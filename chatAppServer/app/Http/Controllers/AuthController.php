<?php

namespace App\Http\Controllers;

use App\User;
use Auth;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function register(Request $request){
        $user = User::create([
            'name' => $request->input('name'),
            'phone' => $request->input('phone'),
            'email'    => $request->input('email'),
            'password' => $request->input('password'),
         ]);
        
        $user->contacts()->save($user);
        
        $token = auth()->login($user);

        return $this->respondWithToken($token);
    }
    public function login(){
        $credentials = request(['email', 'password']);

        if (! $token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }
    public function logout(){

        auth()->logout();

        return response()->json([
            'status' => 'success',
            'message' => 'logout'
        ], 200);
    }
    protected function respondWithToken($token){
        return response()->json([
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => auth()->factory()->getTTL() * 60
        ]);
    }
    public function currentUser(Request $request){
        
        $user = User::find(auth()->user()->id);
        return response()->json([
            'user'   => $user,
        ]);
    }
}
