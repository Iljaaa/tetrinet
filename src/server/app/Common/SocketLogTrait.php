<?php

namespace App\Common;

use Illuminate\Support\Facades\Log;

trait SocketLogTrait
{

    /**
     * todo: move to trait
     * @param string $message
     * @param array $data
     * @return void
     */
    private function info (string $message, array $data = []) :void
    {
        Log::channel('socket')->info($message, $data);
    }

    /**
     * todo: move to trait
     * @param string $message
     * @param array $data
     * @return void
     */
    private function error (string $message, array $data = []) :void
    {
        Log::channel('socket')->error($message, $data);
    }
}