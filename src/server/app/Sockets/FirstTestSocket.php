<?php

namespace App\Sockets;

use App\Common\Cup;
use App\Common\Party;
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
     * @var Party|null
     */
    private Party|null $party = null;


    /**
     * Cup object for sinchronize
     * @var Cup
     */
    private Cup $cup;

    public function __construct()
    {
        $this->cup = new Cup();
    }

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

            if ($data['type'] == 'join') {
                Log::channel('socket')->info("type:start");
                $this->processJoinToParty($connection, $data);
            }

            // save player cup
            if ($data['type'] == 'set')
            {
                Log::channel('socket')->info("type:set", $data);
                $this->processSet($connection, $data);
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

                // todo: generate and return id in the party
                $connection->send(json_encode([
                    'response' => 'Thanx save'
                ]));
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
     * Create new party and ad it self to this
     * @param ConnectionInterface $connection
     * @param array $data
     * @return void
     * @throws \Random\RandomException
     */
    private function processStartParty (ConnectionInterface $connection, array $data)
    {
        Log::channel('socket')->info(__METHOD__);

        // clean up party
        // $this->party = [$connection];

        // store cup into redis
        // Redis::set('cup', json_encode($data['cup']));

        // create party id
        $this->party = new Party($connection);

        //
        $connection->send(json_encode([
            'partyId' => $this->party->partId,
            'yourIndex' => 0,
        ]));
    }

    /**
     * Join to party
     * @param ConnectionInterface $connection
     * @param array $data
     * @return void
     * @throws \Random\RandomException
     */
    private function processJoinToParty (ConnectionInterface $connection, array $data)
    {
        Log::channel('socket')->info(__METHOD__);

        // join connection in party
        $playerIndex = $this->party->addPlayer($connection);

        $connection->send(json_encode([
            'partyId' => $this->party->partId,
            'yourIndex' => $playerIndex,
        ]));

        // if we have full party send signal to players
        if ($this->party->isPartFull()) {
            foreach ($this->party->getPlayers() as $connection) {
                $data = [
                    'type' => 'letsPlay'
                ];
                $connection->send(json_encode($data));
            }
        }
    }

    /**
     * @param ConnectionInterface $connection
     * @param array $data
     * @return void
     */
    private function processSet (ConnectionInterface $connection, array $data)
    {
        $players = $this->party->getPlayers();
        Log::channel('socket')->info("party", ['len' => count($players)]);

        // player index in party
        $partyIndex = (int) $data['partyIndex'];
        Log::channel('socket')->info("part", ['partyIndex' => $partyIndex]);

        // todo: update cup state in party
        // $cup = new Cup($data['cup']);
        $this->cup->setCupByPartyIndex($partyIndex, $data['cup']);

        // Log::channel('socket')->info("party", ['len' => count($this->party)]);

        // store cup into redis
        // todo here we need to clear cup
        // Redis::set('cup', json_encode($data['cup']));

        // send data to all connections
        foreach ($players as $con) {
            $con->send(json_encode([
                'cup' => $this->cup->cup
            ]));
        }
    }
}
