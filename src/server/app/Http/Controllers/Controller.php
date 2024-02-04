<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;
use Illuminate\View\View;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * @return View
     */
    public function welcome (): View
    {
        // $a = Redis::get('aaaa');
        // Log::channel('socket')->info('test222');
        $cssFiles = scandir(public_path('static'.DIRECTORY_SEPARATOR.'css'));
        $cssFiles = array_filter($cssFiles, function (string $file){
            if ($file == "." || $file == "..") return false;
            if (pathinfo($file, PATHINFO_EXTENSION) != 'css') return false;
            if (!str_starts_with($file, 'main')) return false;
            return true;
        });

        $jsFiles = scandir(public_path('static'.DIRECTORY_SEPARATOR.'js'));
        $jsFiles = array_filter($jsFiles, function (string $file){
            if ($file == "." || $file == "..") return false;
            if (pathinfo($file, PATHINFO_EXTENSION) != 'js') return false;
            // if (!str_starts_with($file, 'main')) return false;
            return true;
        });

        return view('welcome', [
            'cssFiles' => $cssFiles,
            'jsFiles' => $jsFiles
        ]);
    }
}
