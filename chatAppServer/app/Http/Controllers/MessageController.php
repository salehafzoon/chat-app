<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Message;
use App\User;
use App\Chat;
use DB;

class MessageController extends Controller
{

    public function autherize(Request $request)
    { }
    public function send(Request $request)
    {
        $chat =Chat::find($request->chat_id);

        if (is_null($chat)) {
            return response()->json([
                'message' => 'chat not found',
            ], 200);
        }
        
        if($chat->is_private == 1 or $chat->is_channel == 1 ){
            $res = DB::table('chat_user')->where('chat_id', $request->chat_id)
                ->where('user_id', auth()->user()->id)
                ->where('permission', 'ADMIN')
                ->get();

            if (count($res)==0) {
                return response()->json([
                    'message' => 'not allowed',
                ], 403);
            }
        }

        $message = new Message;
        $message->content = $request->content;
        $message->chat_id = $request->chat_id;

        $message->save();

        return response()->json([
            'message' => 'message sended',
            'user_id'=> auth()->user()->id
        ], 200);
    }
    public function chatMessages(Request $request)
    {

        $chat = Chat::find($request->chat_id);

        return response()->json([
            'chat_messages' => $chat->messegaes
        ], 200);
    }
}
