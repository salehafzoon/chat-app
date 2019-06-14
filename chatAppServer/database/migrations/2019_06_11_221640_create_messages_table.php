<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMessagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->increments('id');
            $table->string('content');
            $table->timestamp('send_date')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamps();

            $table->integer('sender_id')->unsigned()->index();
            $table->foreign('sender_id')->references('id')->on('users');
        
            $table->integer('rec_id')->unsigned()->index();
            $table->foreign('rec_id')->references('id')->on('users');
        
        });

        Schema::create('message_user', function (Blueprint $table) {
            $table->increments('id');
        
            $table->integer('user_id')->unsigned()->index();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        
            $table->integer('message_id')->unsigned()->index();
            $table->foreign('message_id')->references('id')->on('messages')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('message_user');
        Schema::dropIfExists('messages');
    }
}
