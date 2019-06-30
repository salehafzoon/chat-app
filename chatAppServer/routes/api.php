<?php

use Illuminate\Http\Request;


Route::post('auth/register', 'AuthController@register');
Route::post('auth/login', 'AuthController@login');

Route::group(['middleware' => ['jwt.verify']], function () {

    Route::get('/logout', 'AuthController@logout')->name('api.jwt.logout');
    Route::get('user/me', 'AuthController@currentUser');
    
    Route::get('user/contact', 'UserController@userContacts');
    Route::post('user/contact/add', 'UserController@userAddContact');

    Route::post('/user/search', 'UserController@searchUser');
    Route::get('/user/chat', 'UserController@userChats');

    Route::post('/chat/create', 'ChatController@create');
    Route::post('/chat/delete', 'ChatController@delete');
    Route::post('/chat/info', 'ChatController@info');
    Route::post('/chat/is_admin', 'ChatController@isAdmin');

    Route::post('/chat/member/add', 'ChatController@addMember');
    Route::post('/chat/member/delete', 'ChatController@deleteMember');
    Route::get('/chat/member', 'ChatController@members');

    Route::post('/chat/message', 'MessageController@chatMessages');
    Route::post('/chat/message/send', 'MessageController@send');
});
