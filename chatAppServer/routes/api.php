<?php

use Illuminate\Http\Request;


Route::group(['middleware' => ['jwt.verify']], function() {

    Route::get('/logout', 'AuthController@logout')->name('api.jwt.logout');
    
    Route::get('/user/search', 'UserController@searchUser');
    Route::post('/user/block_or_unblock', 'UserController@blockOrUnblockUser');
    Route::get('/user/block_list', 'UserController@blockList');
    
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

