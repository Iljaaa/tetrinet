<?php

namespace App\Sockets;

use Illuminate\Support\Facades\Log;
use Ratchet\App;
use Ratchet\ConnectionInterface;
use Ratchet\RFC6455\Messaging\MessageInterface;
use Ratchet\WebSocket\MessageComponentInterface;

class FirstTestSocket implements MessageComponentInterface
{


    public function onOpen(ConnectionInterface $connection)
    {
        Log::channel('socket')->info(__METHOD__);

        // generate socket is
        $socketId = sprintf('%d.%d', random_int(1, 1000000000), random_int(1, 1000000000));
        $connection->socketId = $socketId;

        // what this code do?
        // $connection->app = App::findById('YOUR_APP_ID');
        $app = \BeyondCode\LaravelWebSockets\Apps\App::findById("app_id");
        $connection->app = $app;
    }

    public function onClose(ConnectionInterface $connection)
    {
        Log::channel('socket')->info(__METHOD__);
    }

    public function onError(ConnectionInterface $connection, \Exception $e)
    {
        Log::channel('socket')->info(__METHOD__);
        Log::channel('socket')->info($e->getMessage());
    }

    public function onMessage(ConnectionInterface $connection, MessageInterface $msg)
    {
        Log::channel('socket')->info(__METHOD__);
        Log::channel('socket')->info("count", [$msg->count()]);
        Log::channel('socket')->info("contents", [$msg->getContents()]);

        // send message
        $connection->send("back message");
    }
}
