<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use Auth;
use DB;

class UserController extends Controller
{

    public function searchUser(Request $request){
        $results = DB::table('users')
            ->where('name', 'LIKE', '%' . $request->name . '%')
            ->get();
        
        return response()->json([
            'users' => $results
        ],200);
    }
    public function blockOrUnblockUser(Request $request){
        $blockUser =User::find($request->user_id);
        $action = $request->action;
        if(!($action =='block' or $action == 'unblock')){
            return response()->json([
                'message'=>'invalid action'
            ],200);
        }
        if(is_null($blockUser)){
            return response()->json([
                'message'=> 'user not found',
            ],200);
        }
        $user = auth()->user();
        if($action == 'block'){

            $user->blockUsers()->attach($blockUser);

            return response()->json([
                'message'=> 'user successfully blocked'
            ],200);
        }
        if($action == 'unblock'){
         
            $user->blockUsers()->detach($blockUser);

            return response()->json([
                'message'=> 'user successfully unblocked',
            ],200);
        }
    }
    public function blockList(Request $request){
        if(auth()->user()->id != $request->user_id)
            
        return response()->json([
            'message'=>'you are not allowed'
        ],504);

        $user = Auth::user();
        $user->blockUsers()->pull();

        return response()->json([
            'blocked users'=>$user->blockUsers
        ]);
    }
    public function userChats(Request $request){

        $user = User::find(Auth::user()->id);
        
        return response()
        ->json(['chats' => $user->chats
        ],200);

    }

}
