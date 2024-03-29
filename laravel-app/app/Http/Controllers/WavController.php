<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
// use Spatie\Backtrace\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;
use ZanySoft\Zip\Zip;
use Illuminate\Support\Facades\File;
use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;

class WavController extends Controller
{
    public $content;
    public function upload(Request $request)
    {
        Storage::deleteDirectory('public');

        // formDataからfileを取り出す
        $files = $request->file;
        $filename = $files;

        // ファイルを配列に格納し、さらに変数に格納
        $lines = file($filename, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        // dd($lines);
        foreach ($lines as $file) {
            $apiAudioQueryUrl = env("VOICEVOX_API_ENDPOINT") . "/audio_query?text={$file}&speaker=1";
            $apiSynthesisUrl = env("VOICEVOX_API_ENDPOINT") . "/synthesis?speaker=1";

            $audioQueryRes = Http::retry(3, 1000)->post($apiAudioQueryUrl);

            if ($audioQueryRes->failed()) {
                dd('NGQ');
            }
            $synthesisRes = Http::post($apiSynthesisUrl, $audioQueryRes->json());
            $wav = $file . ".wav";
            if ($synthesisRes->failed()) {
                dd("NGS");
            }
            Storage::put("public/{$wav}", $synthesisRes->body());
        }
    }
    public function download()
    {
        $filePaths = Storage::files("public");
        // $mimeType = 'audio/x-wav';
        // $headers = [['Content-Type' => $mimeType]];
        // $filPaths = Storage::get("public/あなたも半分必ずしも.wav");
        // dd($filePaths);
        // dd($filePaths);
        // $files = File::files($filePaths);
        // dd($files);
        $filenames = [];
        foreach ($filePaths as $file) {
            $filename = substr($file, 7);
            $filenames[] = $filename;
        }
        // dd($filenames);
        return $filenames;
    }
    public function dl($index)
    {
        $filePaths = Storage::files("public");

        $filPaths = Storage::path($filePaths[$index]);
        // dd($filPaths);
        $mimeType = 'audio/x-wav';
        $headers = [['Content-Type' => $mimeType]];
        // $DL_file = $filePaths[$index];
        return response()->download($filPaths, "audio.wav", $headers);
    }
}
