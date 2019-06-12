<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;

use DB;

class UserController extends Controller
{
    public function messages(Request $request)
    {
        $user = User::find($request->user_id);
        
        return response()->json([
            'messages' => $user ->messages
        ],200);
    }
    public function groups(Request $request){
        
        $user = User::find($request->user_id);
        
        return response()->json([
            'members' => $user ->groups
        ],200);
    }
}
