<?php

namespace App\Sockets;

use Illuminate\Support\Facades\Log;
// use Ratchet\App;
use Illuminate\Support\Facades\Redis;
use Ratchet\ConnectionInterface;
use Ratchet\RFC6455\Messaging\MessageInterface;
use Ratchet\WebSocket\MessageComponentInterface;

class FirstTestSocket implements MessageComponentInterface
{
    /**
     * @var int[]
     */
    // private $tempCup = [-1,-1,-1,-1,1,1,1,1,1,1,1,1,1,-1,1,1,1,1,1,1,-1,-1,-1,-1,0,0,-1,-1,-1,-1,-1,-1,-1,-1,0,0,-1,-1,-1,-1,-1,-1,-1,-1,0,0,-1,-1,-1,-1,-1,-1,-1,-1,0,0,-1,-1,-1,-1,-1,-1,-1,-1,0,0,-1,-1,-1,-1,-1,-1,-1,0,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,0,-1,-1,-1,-1,-1,-1,-1,-1,0,0,-1,-1,-1,-1,-1,-1,-1,-1,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];

    const TYPE_START_PARTY = 'start_party';
    const TYPE_JOIN_PART = 'join_party';

    /**
     * This is play party
     * @var ConnectionInterface[]
     */
    private array $party = [];

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
        // we do not send anything when connection is open
        // $data = ['type' => 'welcome', 'id' => $connection->socketId];
        // $connection->send(json_encode($data));
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
     * @throws RandomException
     */
    public function onMessage(ConnectionInterface $connection, MessageInterface $msg)
    {
        Log::channel('socket')->info(__METHOD__);
        // Log::channel('socket')->info("count", [$msg->count()]);
        // Log::channel('socket')->info("contents", [$msg->getContents()]);

        // dd($msg->getPayload());
        $data = json_decode($msg->getPayload(), true);
        // Log::channel('socket')->info("data", $data);

        //
        if (isset($data['type']))
        {
            // start new party
            if ($data['type'] == 'start') {
                Log::channel('socket')->info("type:start");
                $this->processStartParty($connection, $data);
            }

            // deprecated mathod
            if ($data['type'] == 'play' && !empty($data['cup']))
            {
                Log::channel('socket')->info("type:play");
                // Log::channel('socket')->info("save", $data['cup']);

                // add connection to the party
                $this->party[] = $connection;

                // store cup into redis
                // todo here we need to clear cup
                Redis::set('cup', json_encode($data['cup']));

                //
                $connection->send(json_encode(['response' => 'Thanx save']));
            }

            // save player cup
            if ($data['type'] == 'set' && !empty($data['cup']))
            {
                Log::channel('socket')->info("type:set");
                Log::channel('socket')->info("party", ['len' => count($this->party)]);

                // store cup into redis
                // todo here we need to clear cup
                Redis::set('cup', json_encode($data['cup']));

                // send data to all conecetions
                foreach ($this->party as $con) {
                    $con->send(json_encode([
                        'cup' => $data
                    ]));
                }

            }

            // we start watching
            if ($data['type'] == 'watch')
            {
                Log::channel('socket')->info("type:watch");

                // add connection to the party
                $this->party[] = $connection;

                $data = json_decode(Redis::get('cup'), true);
                Log::channel('socket')->info("watch", $data ?? []);

                $connection->send(json_encode([
                    'cup' => $data
                ]));
            }
        }

        // if we receive state, we save it
        // $data = json_decode($msg->getContents());

        //

        // return

        // send message
        // send random method
        // $connection->send(json_encode($this->tempCup));
    }

    /**
     * @param ConnectionInterface $connection
     * @param array $data
     * @return void
     * @throws RandomException
     */
    private function processStartParty (ConnectionInterface $connection, array $data)
    {
        Log::channel('socket')->info(__METHOD__);

        // add connection to the party
        $this->party[] = $connection;

        // store cup into redis
        // Redis::set('cup', json_encode($data['cup']));

        // create party id

        // create host id
        $hostId = sprintf('%d.%d', random_int(1, 1000000000), random_int(1, 1000000000));

        $party = [
            'host' => $hostId
        ];

        Redis::set('party', json_encode($party));

        //
        $connection->send(json_encode(['response' => 'New party created']));
    }
}
