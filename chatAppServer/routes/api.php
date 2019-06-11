<?php

use Illuminate\Http\Request;


// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });


Route::group(['middleware' => 'auth:api'], function(){
    Route::get('/logout', 'AuthController@logout')->name('api.jwt.logout');
    Route::post('/message/send', 'MessageController@create');
    
});

Route::post('/register', 'AuthController@register');

Route::post('/login', 'AuthController@login');

// Route::post('/logout', 'AuthController@logout');

