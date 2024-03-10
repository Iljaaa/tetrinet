<?php

namespace App\Http\Controllers;

use App\Http\Requests\FeedbackRequest;
use App\Models\Feedback;
use Illuminate\Http\JsonResponse;

class FeedbackController
{
    public function feedback(FeedbackRequest $request): JsonResponse
    {
        $this->sendMessageToTelegram($request);

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

    private function sendMessageToTelegram (FeedbackRequest $request)
    {
        $m = "New feedback: ".$request->variant.
            "\r\nfrom: ".$request->name.
            "\r\nemail: ".$request->email.
            "\r\n\r\nmessage:\r\n".$request->message;

        $messageBot = app('telergambot');
        $messageBot->sendMessage($m);

    }


}
