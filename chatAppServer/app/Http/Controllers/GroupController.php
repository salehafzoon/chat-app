<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Group;
use DB;

class GroupController extends Controller
{
    public function create(Request $request)
    {
        $group = new Group;
        $group->name = $request->name;
        $group->creator_id = $request->creator_id;
        $group->is_channel = $request->is_channel;

        $group->save();

        return response()->json([
            'status' => 'success',
            'message' => 'group created'
        ], 200);
    }
    public function delete(Request $request)
    {
        $group = Group::find($request->group_id);
        $group->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'group deleted',
        ], 200);
    }
    public function search(Request $request)
    {
        $results = DB::table('groups')
            ->where('name', 'LIKE', '%' . $request->name . '%')
            ->get();
        
        return response()->json([
            'groups' => $results
        ],200);
    }
}
