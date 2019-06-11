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
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('messages');
    }
}
