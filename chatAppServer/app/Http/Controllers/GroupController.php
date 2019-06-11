<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Group;

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
}
