<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;
use ZanySoft\Zip\Zip;
use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;
use Illuminate\Support\Facades\File;


class VttController extends Controller
{
    public function upload(Request $request)
    {
        Storage::deleteDirectory('public/video');

        // dd($request->all());
        // formDataからfileを取り出す
        // dd($files);
        $files =  $request->file;
        $filename = $files->getClientOriginalName();
        // $content = File::get($files);
        // dd($content);
        // $fileName = $request->file->getClientOriginalName();
        // $file = $request->file;
        // dd($filename, $files);
        Storage::put("public/video/$filename", $files);
        $filePaths = Storage::files("public/video/$filename");
        $videoPaths = substr($filePaths[0],13);
        // dd($videoPaths);
        return $videoPaths;
        // $filesIn = File::get($files);
    }

    public function uploads(Request $request)
    {

        // formDataからfileを取り出す
        $files =  $request->file;
        $filename = $files->getClientOriginalName();
        $content = File::get($files);
        // dd($content);
        Storage::put("public/$filename", $content);

        // $filesIn = File::get($files);
        $item = FFMpeg::fromDisk('public')->open($filename);
        // $durationInSeconds = $item->getDurationInSeconds();
        // dd($durationInSeconds);
        // $item = FFMpeg::open($filesIn);
        // $durationInSeconds = $convert->getDurationInSeconds();
        // ファイルを配列に格納し、さらに変数に格納
        $info = array(
            'time' => $this->sToM($item->getDurationInSeconds())
        );
        // dd($info['time']);
        $array = [
            "file_name" => $filename,
            "size" => $info['time']

        ];
        // dd($array);
        $json = json_encode($array, JSON_UNESCAPED_UNICODE);
        // dd($json);
        return $json;
    }

    private  function sToM($seconds)
    {
        //秒を分に変換
        $hours = floor($seconds / 3600);
        $minutes = floor(($seconds / 60) % 60);
        $seconds = $seconds % 60;
        $hms = sprintf("%02d:%02d",  $minutes, $seconds);
        return $hms;
    }
    // public function demoPlay($filename){
    //     path('')
    // }
}
