<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use Auth;
use DB;

class UserController extends Controller
{

    public function searchUser(Request $request)
    {
        $results = DB::table('users')
            ->where('phone', $request->phone)
            ->first();

        if (!$results)
            return response()->json([
                'message' => 'not found'
            ], 400);

        return response()->json([
            'user' => $results
        ], 200);
    }
    public function isBlocked(Request $request)
    {

        $isBlocked = true;

        $res = DB::table('chat_user')->where('chat_id', $request->input('chat_id'))
            ->where('user_id', $request->input('user_id'))
            ->where('permission', 'NOT_ALLOWED')
            ->get();

        if (count($res) == 0)
            $isBlocked = false;

        return response()
            ->json([
                'is_blocked' => $isBlocked
            ], 200);
    }

    public function blockUnblock(Request $request)
    {
        $permission = 'ALLOWED';

        if($request->input('command')=='block')
            $permission = 'NOT_ALLOWED';

        $res = DB::table('chat_user')->where('chat_id', $request->input('chat_id'))
            ->where('user_id', $request->input('user_id'))
            ->update(['permission'=>$permission]);

        return response()
            ->json([
                'message' => 'user '.$request->input('command').'ed'
            ], 200);
    }
    
    public function userChats(Request $request)
    {

        $user = User::find(Auth::user()->id);
        $chats = $user->chats;
        foreach ($chats as $chat) {
            $r = $chat->messeges;
            if ($chat->is_private) {
                foreach ($chat->members as $member) {
                    if ($member->id != auth()->user()->id)
                        $chat->name = $member->name;
                }
            }
        }
        return response()
            ->json([
                'chats' => $chats
            ], 200);
    }

    public function userContacts(Request $request)
    {
        $user = User::find(Auth::user()->id);

        return response()
            ->json([
                'contacts' => $user->contacts
            ], 200);
    }
    public function userAddContact(Request $request)
    {
        $user = User::find(Auth::user()->id);
        $contact = User::find($request->input('contact_id'));

        if (is_null($contact)) {
            return response()
                ->json([
                    'message' => 'contact not found'
                ], 400);
        }

        if ($user->contacts->contains($contact)) {
            return response()
                ->json([
                    'message' => 'contact already added'
                ], 400);
        }

        $user->contacts()->save($contact);
        $contact->contacts()->save($user);

        return response()
            ->json([
                'message' => 'contact added'
            ], 200);
    }
}
