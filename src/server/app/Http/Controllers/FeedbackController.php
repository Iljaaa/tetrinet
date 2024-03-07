<?php

namespace App\Http\Controllers;

use App\Http\Requests\FeedbackRequest;
use Illuminate\Http\JsonResponse;

class FeedbackController
{
    public function feedback(FeedbackRequest $request): JsonResponse
    {
        dd (123);

    }

    private function sendMessageToTelegram()
    {
        $params = [
            'chat_id' => -4120351548,
            'text' => 'aaa'
        ];

        foreach ($params as $key => &$val) {
            // encoding to JSON array parameters, for example reply_markup
            if (!is_numeric($val) && !is_string($val)) {
                $val = json_encode($val);
            }
        }

        $url = 'https://api.telegram.org/bot204492982:AAHcHfaoD3DuKmu0n3fz6T6RbwBgPNfDiXI/sendMessage?'.http_build_query($params);

        $handle = curl_init($url);
        curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($handle, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt($handle, CURLOPT_TIMEOUT, 60);

        curl_exec($handle);
    }
}
