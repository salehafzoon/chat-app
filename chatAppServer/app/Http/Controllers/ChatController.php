<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Chat;
use App\User;
use DB;
use Auth;

class ChatController extends Controller
{
    public function create(Request $request){

        $user = User::find(auth()->user()->id);
            
        $chat = new Chat;
        $chat->name = $request->input('name');
        $chat->is_private = $request->input('isPrivate');
        $chat->is_channel = $request->input('isChannel');
        
        $chat->save();
        
        $others = array();
            
        if(count($request->input('others'))!=1){

            foreach ($request->input('others') as $uid){
            
                $other = User::find($uid);
                
                if(is_null($other)){
                    $chat->delete();
                    return response()->json(['message' => 'user not found',
                        ],200);
                }
                array_push($others,$other);
            }
            
            $chat->members()->save($user);

            DB::table('chat_user')
            ->where('user_id',$user->id)
            ->where('chat_id',$chat->id)
            ->update(['permission' => "ADMIN"]);
            
            $chat->members()->saveMany($others);
         
        }else{
            $chat->members()->save($user);
            $other = User::find( $request->input('others')[0] );
            
            if(is_null($other)){
                $chat->delete();
                return response()->json(['message' => 'user not found',
                    ],200);
            }

            $chat->members()->save($other);
            DB::table('chat_user')->where('chat_id',$chat->id)->update(['permission' => "ADMIN"]);
        }

        return response()->json([
            'message' => 'chat created',
        ], 200);
    }
    public function delete(Request $request){

        $chat = Chat::find( $request->chat_id);

        if(is_null($chat)){
            return response()->json(['message' => 'chat not found',
                ],200);
        }
        $chat->delete();
    
        return response()->json(['message' => 'chat deleted',
        ],200);

    }
    public function info(Request $request){
        $chat = Chat::find( $request->chat_id);

        if(is_null($chat)){
            return response()->json(['message' => 'chat not found',
                ],200);
        }

        return response()->json(['info' => $chat
        ],200);
    }
    public function addMember(Request $request){

        $chat = Chat::find( $request->chat_id);
        $user = User::find($request->user_id);

        if(is_null($chat) or is_null($user)){
            return response()->json(['message' => 'chat or user not found',
                ],200);
        }

        if($chat->members->contains($user))
            return response()->json(['message' => 'user is already a member',
                ],200);
        
        $chat->members()->save($user);

        return response()
        ->json(['message' => 'member added'
        ],200);
    }

    public function deleteMember(Request $request){

        $chat = Chat::find( $request->chat_id);
        $user = User::find($request->user_id);

        if(is_null($chat) or is_null($user)){
            return response()->json(['message' => 'chat or user not found',
                ],200);
        }

        DB::table('chat_user')->where('chat_id', $chat->id)->where('user_id', $user->id)->delete();

        return response()
        ->json(['message' => 'member deleted'
        ],200);

    }

    public function members(Request $request){

        $chat = Chat::find($request->chat_id);
        
        if(is_null($chat))
            return response()->json(['message' => 'not found',
                ],200);
       
        if(!$chat->members->contains(auth()->user()))
            return response()->json(['message' => 'not allowed',
                ],403);
        
        return response()->json(['members' => $chat->members,
            ],200);
    }
}
