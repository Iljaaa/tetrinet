<?php

namespace App\Http\Controllers;

use App\Http\Requests\FeedbackRequest;
use App\Models\Feedback;
use Illuminate\Http\JsonResponse;

class FeedbackController
{
    public function feedback(FeedbackRequest $request): JsonResponse
    {
        $this->sendMessageToTelegram($request->variant, $request->name ?? '', $request->email ?? '', $request->message ?? '');

        // save to db
        $f = new Feedback();
        $f->variant = $request->variant;
        $f->name = $request->name;
        $f->email = $request->email;
        $f->message = $request->message;
        $f->save();

        // send to telegram

        return response()->json([
            'success' => true
        ]);

    }

    /**
     * @param string $variant
     * @param string $name
     * @param string $email
     * @param string $message
     * @return void
     */
    private function sendMessageToTelegram(string $variant, string $name, string $email, string $message): void
    {
        $botToken = env('TELEGRAM_BOT_TOKEN');
        $chatId = env('TELEGRAM_BOT_CHAT_ID');

        $m = "New feedback: ".$variant.
            "\r\nfrom: ".$name.
            "\r\nemail: ".$email.
            "\r\n\r\nmessage:\r\n".$message;

        $params = [
            'chat_id' => $chatId,
            'text' => $m
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
