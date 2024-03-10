<?php

namespace App\Services;

class TelegramBotService
{
    /**
     * @param string $message
     * @return void
     */
    public static function sendMessage(string $message): void
    {
        $botToken = env('TELEGRAM_BOT_TOKEN');
        $chatId = env('TELEGRAM_BOT_CHAT_ID');

        $params = [
            'chat_id' => $chatId,
            'text' => $message
        ];

        foreach ($params as $key => &$val) {
            // encoding to JSON array parameters, for example reply_markup
            if (!is_numeric($val) && !is_string($val)) {
                $val = json_encode($val);
            }
        }

        $url = 'https://api.telegram.org/bot204492982:'.$botToken.'/sendMessage?'.http_build_query($params);

        $handle = curl_init($url);
        curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($handle, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt($handle, CURLOPT_TIMEOUT, 60);

        curl_exec($handle);
    }

}
