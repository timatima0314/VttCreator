<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Backtrace\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class WavController extends Controller
{
    public $content;
    public function upload(Request $request)
    {
        // formDataからfileを取り出す
        // $files =  $request->file;
        // $filename = $files;

        // ファイルを配列に格納し、さらに変数に格納
        // $lines = file($filename, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        // foreach ($lines as $file) {
        //     $apiAudioQueryUrl = env("VOICEVOX_API_ENDPOINT") . "/audio_query?text={$file}&speaker=1";
        //     $apiSynthesisUrl = env("VOICEVOX_API_ENDPOINT") . "/synthesis?speaker=1";

        //     $audioQueryRes = Http::retry(3, 1000)->post($apiAudioQueryUrl);

        //     if ($audioQueryRes->failed()) {
        //         dd('NGQ');
        //     }
        //     $synthesisRes = Http::post($apiSynthesisUrl, $audioQueryRes->json());
        //     $wav = trim(mb_substr($file, 0, 20)) . ".wav";
        //     if ($synthesisRes->failed()) {
        //         dd("NGS");
        //     }
        //     // Storage::put("public/{$wav}", $synthesisRes->body());
        //     // $filePath = ;
        // }
        // レスポンスを返します。
        $filePath = Storage::path("public/tt.wav");
        $mimeType = Storage::mimeType('public/tt.wav');
        // dump($filePath);
        $headers = [['Content-Type' => $mimeType]];
        return response()->download($filePath, 'tt.wav', $headers);
    }
}