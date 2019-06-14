<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Message;
use App\User;

class MessageController extends Controller
{
    
    public function autherize(Request $request){
        
    }
    public function create(Request $request){

        if(auth()->user()->id != $request->sender_id)
            return response()->json([
                'status' => 'forbiden',
            ], 403);
            
        $message = new Message;
        $message->content = $request->content;
        $message->sender_id = $request->sender_id;
        $message->rec_id = $request->rec_id;
        
        $message->save();

        $sender = User::find($request->sender_id);
        $reciever = User::find($request->rec_id);
        
        $message->users()->save($sender);
        $message->users()->save($reciever);

        return response()->json([
            'status' => 'success',
            'message' => 'message sended',
        ], 200);
    }
    public function userMessages(Request $request){

        $user = User::find($request->user_id);
        
        return response()->json([
            'user_messages' => $user ->messages
        ],200);
    }
    
}
