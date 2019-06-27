<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Message;
use App\User;
use App\Chat;


class MessageController extends Controller
{
    
    public function autherize(Request $request){
        
    }
    public function send(Request $request){

        $message = new Message;
        $message->content = $request->content;
        $message->chat_id = $request->chat_id;
        
        $message->save();

        return response()->json([
            'message' => 'message sended',
        ], 200);
    }
    public function chatMessages(Request $request){

        $chat = Chat::find($request->chat_id);
        
        return response()->json([
            'chat_messages' => $chat ->messegaes
        ],200);
    }
    
}
