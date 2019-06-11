<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Message;

class MessageController extends Controller
{
    public function create(Request $request)
    {
        $message = new Message;
        $message->content = $request->content;
        $message->sender_id = $request->sender_id;
        $message->rec_id = $request->rec_id;
        
        $message->save();

        return response()->json([
            'status' => 'success',
            'message' => 'message sended'
        ], 200);
    }

}
