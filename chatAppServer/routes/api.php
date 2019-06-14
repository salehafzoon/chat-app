<?php

use Illuminate\Http\Request;


// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });


Route::group(['middleware' => ['jwt.verify']], function() {

    Route::get('/logout', 'AuthController@logout')->name('api.jwt.logout');
    
    Route::post('/message/send', 'MessageController@create');
    Route::get('/message/userMessages', 'MessageController@userMessages');
    
    Route::post('/group/create', 'GroupController@create');
    Route::post('/group/delete', 'GroupController@delete');
    Route::get('/group/search', 'GroupController@search');
    Route::get('/group/members', 'GroupController@members');
    Route::post('/group/addMember', 'GroupController@addMember');
    Route::post('/group/deleteMember', 'GroupController@deleteMember');
    Route::get('/group/userGroups', 'GroupController@userGroups');
    
});

Route::post('/register', 'AuthController@register');

Route::post('/login', 'AuthController@login');

// Route::post('/logout', 'AuthController@logout');

