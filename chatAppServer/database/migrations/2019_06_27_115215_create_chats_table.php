<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateChatsTable extends Migration
{
    

    public function up()
    {
        Schema::create('chats', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('name');
            $table->boolean('is_private')->default(1);   
            $table->boolean('is_channel')->default(0);   
            
        });

        Schema::create('chat_user', function (Blueprint $table) {
            $table->increments('id');
            $table->string('permission')->default('ALLOWED');
        
            $table->integer('user_id')->unsigned()->index();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            $table->integer('chat_id')->unsigned()->index();
            $table->foreign('chat_id')->references('id')->on('chats')->onDelete('cascade');
        
        });
    
    }

    public function down()
    {
        
        Schema::dropIfExists('chat_user');
        Schema::dropIfExists('chats');
    }
}
