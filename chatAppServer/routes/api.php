<?php

use Illuminate\Http\Request;


Route::post('auth/register', 'AuthController@register');
Route::post('auth/login', 'AuthController@login');

Route::group(['middleware' => ['jwt.verify']], function () {
    
    Route::get('/logout', 'AuthController@logout')->name('api.jwt.logout');

    Route::get('user/me', 'AuthController@currentUser');

    Route::get('/user/search', 'UserController@searchUser');
    Route::get('/user/chat', 'UserController@userChats');

    Route::post('/chat/create', 'ChatController@create');
    Route::post('/chat/delete', 'ChatController@delete');
    Route::get('/chat/info', 'ChatController@info');

    Route::post('/chat/member/add', 'ChatController@addMember');
    Route::post('/chat/member/delete', 'ChatController@deleteMember');
    Route::get('/chat/member', 'ChatController@members');

    Route::get('/chat/message', 'MessageController@chatMessages');
    Route::post('/chat/message/send', 'MessageController@send');
});

