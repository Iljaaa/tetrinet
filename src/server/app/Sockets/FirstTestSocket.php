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

    const MESSAGE_START = 'start_party';
    const MESSAGE_JOIN = 'join_party';
    const MESSAGE_ADD_LINE = 'addLine';

    /**
     * This is play party
     * @var Party|null
     */
    private Party|null $party = null;

    /**
     * Cup object for sinchronize
     * todo: move is to the party
     * @var Cup
     */
    private Cup $cup;

    public function __construct()
    {
        $this->cup = new Cup();
    }

    /**
     * @param ConnectionInterface $conn
     * @return void
     * @throws \Random\RandomException
     */
    public function onOpen(ConnectionInterface $conn)
    {
        Log::channel('socket')->info(__METHOD__);

        // generate socket is
        $socketId = sprintf('%d.%d', random_int(1, 1000000000), random_int(1, 1000000000));
        $conn->socketId = $socketId;

        //
        Log::channel('socket')->info(sprintf('Connection open with %s', $socketId));

        // what this code do?
        // $connection->app = App::findById('YOUR_APP_ID');
        $app = \BeyondCode\LaravelWebSockets\Apps\App::findById("app_id");
        $conn->app = $app;

        // send connection id to client
        // we do not send anything when connection is open
        // $data = ['type' => 'welcome', 'id' => $connection->socketId];
        // $connection->send(json_encode($data));
    }

    /**
     * @param ConnectionInterface $conn
     * @return void
     */
    public function onClose(ConnectionInterface $conn): void
    {
        Log::channel('socket')->info(__METHOD__);
    }

    /**
     * @param ConnectionInterface $conn
     * @param \Exception $e
     * @return void
     */
    public function onError(ConnectionInterface $conn, \Exception $e): void
    {
        Log::channel('socket')->info(__METHOD__);
        Log::channel('socket')->info($e->getMessage());
    }

    /**
     * @param ConnectionInterface $conn
     * @param MessageInterface $msg
     * @return void
     */
    public function onMessage(ConnectionInterface $conn, MessageInterface $msg):void
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
                $this->processStartParty($conn, $data);
            }

            if ($data['type'] == 'join') {
                Log::channel('socket')->info("type:start");
                $this->processJoinToParty($conn, $data);
            }

            // save player cup
            if ($data['type'] == 'set')
            {
                Log::channel('socket')->info("type:set", $data);
                $this->processSet($conn, $data);
            }

            // add line to opponent
            if ($data['type'] == static::MESSAGE_ADD_LINE)
            {
                Log::channel('socket')->info("type:".static::MESSAGE_ADD_LINE, $data);
                $this->processAddLine($conn, $data);
            }

            // deprecated mathod
            if ($data['type'] == 'play' && !empty($data['cup']))
            {
                Log::channel('socket')->info("type:play");
                // Log::channel('socket')->info("save", $data['cup']);

                // add connection to the party
                $this->party[] = $conn;

                // store cup into redis
                // todo here we need to clear cup
                Redis::set('cup', json_encode($data['cup']));

                // todo: generate and return id in the party
                $conn->send(json_encode([
                    'response' => 'Thanx save'
                ]));
            }

            // we start watching
            if ($data['type'] == 'watch')
            {
                Log::channel('socket')->info("type:watch");

                // add connection to the party
                $this->party[] = $conn;

                $data = json_decode(Redis::get('cup'), true);
                Log::channel('socket')->info("watch", $data ?? []);

                $conn->send(json_encode([
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
     * Create new party and add itself to this
     * @param ConnectionInterface $connection
     * @param array $data
     * @return void
     * @throws \Random\RandomException
     */
    private function processStartParty (ConnectionInterface $connection, array $data):void
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

        // todo: check party id ans if we do not have such party we drop connection
        // todo: check players and we do not have this connection id in party drop this conection

        // player index in party
        $partyIndex = (int) $data['partyIndex'];
        Log::channel('socket')->info("part", ['partyIndex' => $partyIndex]);

        //
        $state = (int) $data['state']; // play, pause, ets

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
                'type' => 'afterSet',
                'responsible' => $partyIndex,
                'state' => $state,
                'cups' => $this->cup->cup
            ]));
        }
    }

    /**
     * @param ConnectionInterface $conn
     * @param array $data
     * @return void
     */
    private function processAddLine (ConnectionInterface $conn, array $data): void
    {
        // send to target player
        // but, now we have two players and if it not a sender then it opponent

        $players = $this->party->getPlayers();
        Log::channel('socket')->info("party", ['len' => count($players)]);

        // player index in party
        $partyIndex = (int) $data['partyIndex'];

        $source = (int) $data['source'];
        $target = (int) $data['target'];
        $linesCount = (int) $data['linesCount'];

        Log::channel('socket')->info("command data", [
            'partyIndex' => $partyIndex,
            'source' => $source,
            'target' => $target,
            'linesCount' => $linesCount,
        ]);

        // this is temporary code
        // we are searching opponent
        /** @var ConnectionInterface $opponentConnection */
        $opponentConnection = null;
        foreach ($players as $pIndex => $p) {
            if ($pIndex !== $source) {
                $opponentConnection = $p;
            }
        }

        // send command to opponent
        if ($opponentConnection) {
            $opponentConnection->send(json_encode([
                'type' => static::MESSAGE_ADD_LINE,
                'source' => $source,
                'target' => $target,
                'linesCount' => $linesCount,
            ]));
        }

    }


}
