<?php

namespace App\Sockets;

use App\Common\Cup;
use app\Common\CupState;
use App\Common\GameState;
use App\Common\MessageType;
use App\Common\Party;
use App\Common\ResponseType;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;
use Ratchet\ConnectionInterface;
use Ratchet\RFC6455\Messaging\MessageInterface;
use Ratchet\WebSocket\MessageComponentInterface;

// use Ratchet\App;

class FirstTestSocket implements MessageComponentInterface
{
    /**
     * @var int[]
     */
    // private $tempCup = [-1,-1,-1,-1,1,1,1,1,1,1,1,1,1,-1,1,1,1,1,1,1,-1,-1,-1,-1,0,0,-1,-1,-1,-1,-1,-1,-1,-1,0,0,-1,-1,-1,-1,-1,-1,-1,-1,0,0,-1,-1,-1,-1,-1,-1,-1,-1,0,0,-1,-1,-1,-1,-1,-1,-1,-1,0,0,-1,-1,-1,-1,-1,-1,-1,0,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,0,-1,-1,-1,-1,-1,-1,-1,-1,0,0,-1,-1,-1,-1,-1,-1,-1,-1,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];

    const MESSAGE_ADD_LINE = 'addLine';

    /**
     * This is play party
     * @var Party|null
     */
    private Party|null $party = null;

    /*
     * Cup object for sinchronize
     * @var Cup
     */
    // private Cup $cup;

//    public function __construct()
//    {
//        // $this->cup = new Cup();
//    }

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
     * @throws RandomException
     */
    public function onMessage(ConnectionInterface $conn, MessageInterface $msg):void
    {
        Log::channel('socket')->info(__METHOD__);
        // Log::channel('socket')->info("count", [$msg->count()]);
        // Log::channel('socket')->info("contents", [$msg->getContents()]);

        // dd($msg->getPayload());
        $data = json_decode($msg->getPayload(), true);
        Log::channel('socket')->info("data", $data);

        if (empty($data['type'])) {
            Log::channel('socket')->info("Type is empty");
            return;
        }

        $messageType = MessageType::from($data['type']);
        Log::channel('socket')->info(sprintf("message.type = %s", $messageType->value));

        switch ($messageType) {
            case MessageType::start: $this->processStartParty($conn, $data); break;
            case MessageType::join: $this->processJoinToParty($conn, $data); break;
            case MessageType::pause: $this->processPause($conn, $data); break;
            case MessageType::resume: $this->processResume($conn, $data); break;
            case MessageType::set: $this->processSet($conn, $data); break;
            case MessageType::addLine: $this->processAddLine($conn, $data); break;
        }


        // start new party
//        if ($data['type'] == 'start') {
//            Log::channel('socket')->info("type:start");
//            $this->processStartParty($conn, $data);
//        }

//        if ($data['type'] == 'join') {
//            Log::channel('socket')->info("type:start");
//            $this->processJoinToParty($conn, $data);
//        }

        // save player cup
//        if ($data['type'] == 'set')
//        {
//            Log::channel('socket')->info("type:set", $data);
//            $this->processSet($conn, $data);
//        }

        // add line to opponent
//        if ($data['type'] == static::MESSAGE_ADD_LINE)
//        {
//            Log::channel('socket')->info("type:".static::MESSAGE_ADD_LINE, $data);
//            $this->processAddLine($conn, $data);
//        }

        // deprecated method
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

        // create party id
        $this->party = new Party($connection);

        //
        $connection->send(json_encode([
            'partyId' => $this->party->partyId,
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

        // set game state is running
        $this->party->setGameState(GameState::running);

        // send to play his id and party index
        $connection->send(json_encode([
            'partyId' => $this->party->partyId,
            'yourIndex' => $playerIndex,
        ]));

        // if we have full party send signal to players to start the game
        if ($this->party->isPartyFull()) {
            foreach ($this->party->getPlayers() as $connection) {
                $data = [
                    'type' => 'letsPlay'
                ];
                $connection->send(json_encode($data));
            }
        }
    }

    /**
     * @param ConnectionInterface $conn
     * @param array $data
     * @return void
     */
    private function processPause(ConnectionInterface $conn, array $data)
    {
        Log::channel('socket')->info(__METHOD__);

        $this->party->setGameState(GameState::paused);

        // send data to all connections
        $players = $this->party->getPlayers();
        foreach ($players as $con) {
            $con->send(json_encode([
                'type' => ResponseType::paused,
                'initiator' => $data['initiator'],
                'state' => $this->party->getGameState(),
            ]));
        }
    }

    /**
     * @param ConnectionInterface $conn
     * @param array $data
     * @return void
     */
    private function processResume(ConnectionInterface $conn, array $data)
    {
        Log::channel('socket')->info(__METHOD__);

        // back to running
        $this->party->setGameState(GameState::running);

        // send data to all connections
        $players = $this->party->getPlayers();
        foreach ($players as $con) {
            $con->send(json_encode([
                'type' => ResponseType::resumed,
                'initiator' => $data['initiator'],
                'state' => $this->party->getGameState(),
            ]));
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
        if (!isset($data['partyIndex']) || $data['partyIndex'] == '') {
            Log::channel('socket')->info("Party index is not set, we ignore this set");
            return;
        }
        $partyIndex = (int) $data['partyIndex'];
        Log::channel('socket')->info("partiIndex", ['partyIndex' => $partyIndex]);

        // global game state
        $state = GameState::from($data['state']) ; // play, pause, game, ets
        Log::channel('socket')->info("gameState", [$state]);

        // save cup info
        $this->party->setCupByPartyIndex($partyIndex, $data['cup']);

        // check game over
         $activeCups = array_filter($this->party->cups, fn (Cup $c) => $c->state == CupState::online);
         // this is global game over
         if (count($activeCups) <= 1) {
             $this->party->setGameState(GameState::over);
             // todo: we need fine a winner
         }


        // preparing cup data
        $cupsData = array_map(fn (Cup $c) => $c->createResponseData(), $this->party->cups);
        Log::channel('socket')->info("response", ['cupsData' => $cupsData]);

        // send data to all players
        foreach ($players as $con) {
            $con->send(json_encode([
                'type' => 'afterSet',
                'responsible' => $partyIndex,
                'state' => $this->party->getGameState(),
                'cups' => $cupsData
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
