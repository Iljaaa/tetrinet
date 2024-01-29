<?php

use App\Sockets\FirstTestSocket;
use BeyondCode\LaravelWebSockets\Facades\WebSocketsRouter;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', [\App\Http\Controllers\Controller::class, 'welcome']);

// socket test
Route::get('/test', function () {
    return view('test');
});

WebSocketsRouter::webSocket('/websocket', FirstTestSocket::class);
