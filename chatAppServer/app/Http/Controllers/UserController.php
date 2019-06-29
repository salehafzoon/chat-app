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
    public function blockOrUnblockUser(Request $request)
    {
        $blockUser = User::find($request->user_id);
        $action = $request->action;
        if (!($action == 'block' or $action == 'unblock')) {
            return response()->json([
                'message' => 'invalid action'
            ], 200);
        }
        if (is_null($blockUser)) {
            return response()->json([
                'message' => 'user not found',
            ], 200);
        }
        $user = auth()->user();
        if ($action == 'block') {

            $user->blockUsers()->attach($blockUser);

            return response()->json([
                'message' => 'user successfully blocked'
            ], 200);
        }
        if ($action == 'unblock') {

            $user->blockUsers()->detach($blockUser);

            return response()->json([
                'message' => 'user successfully unblocked',
            ], 200);
        }
    }
    public function blockList(Request $request)
    {
        if (auth()->user()->id != $request->user_id)

            return response()->json([
                'message' => 'you are not allowed'
            ], 504);

        $user = Auth::user();
        $user->blockUsers()->pull();

        return response()->json([
            'blocked users' => $user->blockUsers
        ]);
    }
    public function userChats(Request $request)
    {

        $user = User::find(Auth::user()->id);
        $chats = $user->chats;
        foreach ($chats as $chat) {
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

        if ( $user->contacts->contains($contact)) {
            return response()
                ->json([
                    'message' => 'contact already added'
                ], 400);
        }
        
        $user->contacts()->save($contact);

        return response()
            ->json([
                'message' => 'contact added'
            ], 200);
    }
}
