<?php

namespace App\Sockets;

use Illuminate\Support\Facades\Log;
use Ratchet\App;
use Ratchet\ConnectionInterface;
use Ratchet\RFC6455\Messaging\MessageInterface;
use Ratchet\WebSocket\MessageComponentInterface;

class FirstTestSocket implements MessageComponentInterface
{

    /**
     * @param ConnectionInterface $connection
     * @return void
     * @throws \Random\RandomException
     */
    public function onOpen(ConnectionInterface $connection)
    {
        Log::channel('socket')->info(__METHOD__);

        // generate socket is
        $socketId = sprintf('%d.%d', random_int(1, 1000000000), random_int(1, 1000000000));
        $connection->socketId = $socketId;

        //
        Log::channel('socket')->info(sprintf('Connection open with %s', $socketId));

        // what this code do?
        // $connection->app = App::findById('YOUR_APP_ID');
        $app = \BeyondCode\LaravelWebSockets\Apps\App::findById("app_id");
        $connection->app = $app;

        // send connection id to client
        $data = ['type' => 'welcome', 'id' => $connection->socketId];
        $connection->send(json_encode($data));
    }

    /**
     * @param ConnectionInterface $connection
     * @return void
     */
    public function onClose(ConnectionInterface $connection)
    {
        Log::channel('socket')->info(__METHOD__);
    }

    /**
     * @param ConnectionInterface $connection
     * @param \Exception $e
     * @return void
     */
    public function onError(ConnectionInterface $connection, \Exception $e)
    {
        Log::channel('socket')->info(__METHOD__);
        Log::channel('socket')->info($e->getMessage());
    }

    /**
     * @param ConnectionInterface $connection
     * @param MessageInterface $msg
     * @return void
     */
    public function onMessage(ConnectionInterface $connection, MessageInterface $msg)
    {
        Log::channel('socket')->info(__METHOD__);
        Log::channel('socket')->info("count", [$msg->count()]);
        Log::channel('socket')->info("contents", [$msg->getContents()]);

        dd($msg->getPayload());

        // if we receive state, we save it
        $data = json_decode($msg->getContents());
        Log::channel('socket')->info("data", $data);

        //

        // return

        // send message
        $connection->send("back message");
    }
}
