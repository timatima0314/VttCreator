<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WavController;
use App\Http\Controllers\VttController;
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

// Route::get('/', function () {
//     return view('welcome');
// });
// home以外でリロード時404回避
Route::get('/{extraUrl?}', function ($extraUrl = null) {
    return view('welcome', [
        'extraUrl' => $extraUrl
    ]);
});
// Route::get('/{any}', static function () {
//     return view('welcome');
// })->where('any', '.*');
Route::post('/wav/upload', [WavController::class, 'upload']);
Route::get('/wav/download', [WavController::class, 'download']);
Route::get('/dl/{index}', [WavController::class, 'dl']);
Route::post('/vtt/upload', [VttController::class, 'upload']);
Route::post('/vtt/uploads', [VttController::class, 'uploads']);

