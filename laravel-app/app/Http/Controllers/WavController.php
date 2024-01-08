<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class WavController extends Controller
{
    public function upload(Request $request)
    {
        // formDataからfileを取り出す
        $image = $request->file;
        dump("aaa");
    }
}
