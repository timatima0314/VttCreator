<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WavController;
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

Route::get('/', function () {
    return view('welcome');
});

Route::post('/upload', [WavController::class, 'upload']);
Route::get('/download', [WavController::class, 'download']);
Route::get('/dl/{index}', [WavController::class, 'dl']);


