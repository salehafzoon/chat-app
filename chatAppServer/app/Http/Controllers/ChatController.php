<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Chat;
use App\User;
use DB;
use Auth;

class ChatController extends Controller
{
    public function create(Request $request)
    {

        $user = User::find(auth()->user()->id);

        $chat = new Chat;
        $chat->name = $request->input('name');
        $chat->is_private = $request->input('isPrivate');
        $chat->is_channel = $request->input('isChannel');


        $others = array();

        if (!$chat->is_private) {

            foreach ($request->input('others') as $uid) {

                $other = User::find($uid);

                if (is_null($other)) {
                    $chat->delete();
                    return response()->json([
                        'message' => 'user not found',
                    ], 200);
                }
                array_push($others, $other);
            }
            $chat->save();
            $chat->members()->save($user);

            $chat->members()->saveMany($others);

            if ($chat->is_channel == 1) {
                foreach ($others as $other) {
                    DB::table('chat_user')
                        ->where('user_id', $other->id)
                        ->where('chat_id', $chat->id)
                        ->update(['permission' => "NOT_ALLOWED"]);
                }
            }

            DB::table('chat_user')
                ->where('user_id', $user->id)
                ->where('chat_id', $chat->id)
                ->update(['permission' => "ADMIN"]);
        } else {

            $other = User::find($request->input('others')[0]);

            if (is_null($other)) {
                return response()->json([
                    'message' => 'user not found',
                ], 200);
            }

            $chat->save();
            $chat->members()->save($user);
            $chat->members()->save($other);
        }

        return response()->json([
            'message' => 'chat created',
        ], 200);
    }
    public function delete(Request $request)
    {

        $chat = Chat::find($request->input('chat_id'));

        if (is_null($chat)) {
            return response()->json([
                'message' => 'chat not found',
            ], 200);
        }

        //delete messages
        DB::table('messages')->where('chat_id', $request->input('chat_id'))->delete();

        //delete members
        DB::table('chat_user')->where('chat_id', $request->input('chat_id'))->delete();

        //delete chat
        $chat->delete();

        return response()->json([
            'message' => 'chat deleted',
        ], 200);

    }
    public function info(Request $request)
    {

        $chat = Chat::find($request->input('chat_id'));

        if (is_null($chat)) {
            return response()->json([
                'message' => 'chat not found',
            ], 200);
        }

        if ($chat->is_private)
            foreach ($chat->members as $member) {
                if ($member->id != auth()->user()->id)
                    $chat->name = $member->name;
            }

        $members = $chat->members;
        return response()->json([
            'info' => $chat,
        ], 200);
    }
    public function uppdateMember(Request $request)
    {


        $chat = Chat::find($request->input('chat_id'));

        if (is_null($chat)) {
            return response()->json([
                'message' => 'chat not found',
            ], 200);
        }

        DB::table('chat_user')->where('chat_id', $request->input('chat_id'))
            ->where('permission', '!=', 'ADMIN')->delete();


        foreach ($request->input('members') as $memberId) {
            $member = User::find($memberId);
            if (is_null($member))
                return response()
                    ->json([
                        'message' => 'user not found'
                    ], 200);

            $chat->members()->save($member);
        }

        return response()
            ->json([
                'members' => $chat->members
            ], 200);
    }

    public function members(Request $request)
    {

        $chat = Chat::find($request->chat_id);

        if (is_null($chat))
            return response()->json([
                'message' => 'not found',
            ], 200);

        if (!$chat->members->contains(auth()->user()))
            return response()->json([
                'message' => 'not allowed',
            ], 403);

        return response()->json([
            'members' => $chat->members,
        ], 200);
    }

    public function isAllowed(Request $request)
    {

        $chat = Chat::find($request->chat_id);

        if (is_null($chat))
            return response()->json([
                'message' => 'chat not found',
            ], 200);

        if (!$chat->members->contains(auth()->user()))
            return response()->json([
                'message' => 'not allowed',
            ], 403);

        $isAllowed = true;

        $res = DB::table('chat_user')->where('chat_id', $request->chat_id)
            ->where('user_id', auth()->user()->id)
            ->where('permission', 'NOT_ALLOWED')
            ->get();

        if (count($res) != 0)
            $isAllowed = false;

        return response()->json([
            'is_allowed' => $isAllowed,
        ], 200);
    }
    public function isAdmin(Request $request)
    {

        $chat = Chat::find($request->chat_id);

        if (is_null($chat))
            return response()->json([
                'message' => 'chat not found',
            ], 200);

        if (!$chat->members->contains(auth()->user()))
            return response()->json([
                'message' => 'not allowed',
            ], 403);

        $isAdmin = true;

        $res = DB::table('chat_user')->where('chat_id', $request->chat_id)
            ->where('user_id', auth()->user()->id)
            ->where('permission', 'ADMIN')
            ->get();

        if (count($res) == 0)
            $isAdmin = false;

        return response()->json([
            'is_admin' => $isAdmin,
        ], 200);
    }
}
