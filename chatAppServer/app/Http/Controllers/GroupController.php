<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Group;
use App\User;
use DB;

class GroupController extends Controller
{

    public function create(Request $request){
        $group = new Group;
        $group->name = $request->name;
        $group->creator_id = auth()->user()->id;
        $group->is_channel = $request->is_channel;

        $group->save();
        $group->members()->sync([
            auth()->user()->id
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'group created'
        ], 200);
    }
    public function delete(Request $request){
        $group = Group::find($request->group_id);
        if(is_null($group))
            return response()->json(['message' => 'not found',
                ],200);
        
        $group->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'group deleted',
        ], 200);
    }
    public function search(Request $request){
        $results = DB::table('groups')
            ->where('name', 'LIKE', '%' . $request->name . '%')
            ->get();
        
        return response()->json([
            'groups' => $results
        ],200);
    }
    public function members(Request $request){

        $group = Group::find($request->group_id);
        if(is_null($group))
            return response()->json(['message' => 'not found',
                ],200);
        if(! $group->members->contains(auth()->user()))
            return response()->json(['message' => 'not allowed',
                ],403);
        
        return response()->json(['group' => $group->members,
            ],200);
    }
    public function deleteMember(Request $request){
        $group = Group::find($request->group_id);
        $user = User::find($request->user_id);
        
        if(is_null($group) or is_null($user) )
            return response()->json(['message' => 'group or user not found',
                ],200);
                
        if($group->creator_id != auth()->user()->id)
            return response()->json(['message' => 'not allowed',
                ],403);

        DB::table('group_user')->where('user_id', $user->id)->where('group_id', $group->id)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'member deleted'
        ],200);  
    }
    public function addMember(Request $request){
        $group = Group::find($request->group_id);
        $user = User::find($request->user_id);
        
        if(is_null($group) or is_null($user) )
            return response()->json(['message' => 'group or user not found',
                ],200);
                
        if($group->creator_id != auth()->user()->id)
            return response()->json(['message' => 'not allowed',
                ],403);

        if($group->members->contains($user))
            return response()->json(['message' => 'user is already a member',
                ],200);
        
        $group->members()->save($user);
        
        return response()->json([
            'status' => 'success',
            'message' => 'member added'
        ],200);      
    }
    public function userGroups(Request $request){
        
        $user = User::find(auth()->user()->id);
        
        return response()->json([
            'user_groups' => $user ->groups
        ],200);
    }
}
