<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;

use DB;

class UserController extends Controller
{

    public function searchUser(Request $request){
        $results = DB::table('users')
            ->where('fname', 'LIKE', '%' . $request->name . '%')
            ->orWhere('lname','LIKE','%' . $request->name . '%')
            ->get();
    
        return response()->json([
            'users' => $results
        ],200);
    }
    public function blockUser(Request $request){
        $user =User::find($request->user_id);
        if(is_null($user))
            return response()->json([
                'message'=> 'not found',
            ]);
    }
}
