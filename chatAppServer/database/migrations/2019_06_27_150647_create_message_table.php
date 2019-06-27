<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMessageTable extends Migration
{
    public function up()
    {
        Schema::create('messages', function (Blueprint $table) {
           
            $table->increments('id');
            $table->string('content');
            $table->timestamp('send_date')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamps();

            $table->integer('chat_id')->unsigned()->index();
            $table->foreign('chat_id')->references('id')->on('chats');
        
        });

    }

    public function down()
    {
        Schema::dropIfExists('messages');
    }

}
