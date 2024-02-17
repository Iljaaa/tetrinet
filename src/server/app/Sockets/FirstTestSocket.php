<?php

namespace App\Sockets;

use app\Common\Connection;
use App\Common\Types\BonusType;
use App\Common\Types\CupState;
use App\Common\GameState;
use App\Common\Types\MessageType;
use App\Common\Party;
use App\Common\Player;
use App\Common\Types\ResponseType;
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
     * Pool of player for play
     * @var Connection[]
     */
    private array $duelPlayersPool = [];


    /**
     * This is play party
     * todo: make pool of parties
     * @var Party|null
     */
    private Party|null $party = null;

    /**
     * @param ConnectionInterface $conn
     * @return void
     * @throws RandomException
     */
    public function onOpen(ConnectionInterface $conn): void
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
        Log::channel('socket')->info(__METHOD__, ['socketId' =>  $conn->socketId]);

        // looking for connection in players pool
        $index = array_search($conn, $this->duelPlayersPool);
        if ($index > -1) {
            Log::channel('socket')->info('connection found in duel pull', ['index' => $index, 'size' => count($this->duelPlayersPool)]);
            // filter from pool out connection
            $this->duelPlayersPool = array_filter($this->duelPlayersPool, fn (ConnectionInterface $c) =>  $c != $conn);
            Log::channel('socket')->info('after filter', ['size' => count($this->duelPlayersPool)]);
        }

        // when connection closed we mark party as paused
        // todo: refactor to many parties
        if ($this->party && $this->party->isConnectionBelongs($conn))
        {
            // set party on pause
            $this->party->pause();
            $this->party->sendToAllPlayers([
                'type' => ResponseType::paused,
                'initiator' => -1,
                'state' => $this->party->getGameState()
            ]);

            // mark in party that user lost connection
            $this->party->onConnectionClose($conn, fn() => $this->onAllPlayersOffline());
        }
    }

    /**
     * this is callback method when all players leave the party and it destoyed
     * @return void
     */
    private function onAllPlayersOffline(): void
    {
        $partyId = $this->party->partyId;
        $this->party = null;
        Log::channel('socket')->info('party '.$partyId.' terminated');
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

        $data = json_decode($msg->getPayload(), true);
        Log::channel('socket')->info("data", $data);

        if (empty($data['type'])) {
            Log::channel('socket')->info("message.type is empty, ignore it");
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
            case MessageType::sendBonus: $this->processSendBonus($conn, $data); break;
        }

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
     * @deprecated
     * Create new party and add itself to this
     * @param ConnectionInterface $connection
     * @param array $data
     * @return void
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
     */
    private function processJoinToParty (ConnectionInterface $connection, array $data): void
    {
        Log::channel('socket')->info(__METHOD__);

        // todo: check type of game and move to this pull

        // add player to pool
        $this->duelPlayersPool[] = $connection;
        Log::channel('socket')->info('connection added to duel pool', ['poolSize' => count($this->duelPlayersPool)]);

        // only two players and the pull is full
        if (count($this->duelPlayersPool) >= 2)
        {
            $this->party = new Party();

            // move players to party
            foreach ($this->duelPlayersPool as $p) {
                $this->party->addPlayer($p);
            }

            // clean up pull
            // todo: may be remove only added connections
            $this->duelPlayersPool = [];

            // run game
            $this->party->setGameState(GameState::running);

            // send to all players information
            $this->party->sendToAllPlayers([
                'type' => ResponseType::letsPlay
            ]);
//            foreach ($this->party->getPlayers() as $index => $player) {
//                $data = [
//                    'type' => ResponseType::letsPlay,
//                    'partyId' => $this->party->partyId,
//                    'yourIndex' => $index,
//                ];
//                $player->getConnection()->send(json_encode($data));
//            }
        }
    }

    /**
     * @param ConnectionInterface $conn
     * @param array $data
     * @return void
     */
    private function processPause(ConnectionInterface $conn, array $data): void
    {
        Log::channel('socket')->info(__METHOD__);

        // pause ga,e
        $this->party->pause();
        // $this->party->setGameState(GameState::paused);

        // send data to all connections
        $this->party->sendToAllPlayers([
            'type' => ResponseType::paused,
            'initiator' => $data['initiator'],
            'state' => $this->party->getGameState(),
        ]);
        /*foreach ($this->party->getPlayers() as $p) {
            $p->getConnection()->send(json_encode([
                'type' => ResponseType::paused,
                'initiator' => $data['initiator'],
                'state' => $this->party->getGameState(),
            ]));
        }*/
    }

    /**
     * @param ConnectionInterface $conn
     * @param array $data
     * @return void
     */
    private function processResume(ConnectionInterface $conn, array $data): void
    {
        Log::channel('socket')->info(__METHOD__);

        // back to running
        $this->party->setGameState(GameState::running);

        // send data to all connections
        $this->party->sendToAllPlayers([
            'type' => ResponseType::resumed,
            'initiator' => $data['initiator'],
            'state' => $this->party->getGameState(),
        ]);
    }

    /**
     * @param ConnectionInterface $connection
     * @param array $data
     * @return void
     */
    private function processSet (ConnectionInterface $connection, array $data): void
    {
        // todo: check party id ans if we do not have such party we drop connection
        // todo: check players and we do not have this connection id in party drop this connection

        // player index in party
        if (!isset($data['partyIndex']) || $data['partyIndex'] == '') {
            Log::channel('socket')->info("Party index is not set, we ignore this set");
            return;
        }
        $partyIndex = (int) $data['partyIndex'];
        Log::channel('socket')->info("partiIndex", ['partyIndex' => $partyIndex]);

        // global game state
        $state = GameState::from($data['state']) ; // play, pause, game over, ets
        Log::channel('socket')->info("gameState", [$state]);

        // save cup info
        $this->party->setCupByPartyIndex($partyIndex, $data['cup']);

        // check game over
         $activeCups = array_filter($this->party->getPlayers(), fn (Player $p) => $p->getCup()->state == CupState::online);

         // this is global game over
         if (count($activeCups) <= 1)
         {
             $this->party->setGameState(GameState::over);

             // mar winner
             foreach ($this->party->getPlayers() as $p) {
                if ($p->getCup()->state == CupState::online) {
                    $p->getCup()->setCupAsWinner();
                    break;
                }
             }
         }

        // preparing cup data
        $cupsData = array_map(fn (Player $p) => $p->getCup()->createResponseData(), $this->party->getPlayers());
        Log::channel('socket')->info("response", ['cupsData' => $cupsData]);

        // send data to all players
        $this->party->sendToAllPlayers([
            // todo: use type from type
            'type' => ResponseType::afterSet,
            'responsible' => $partyIndex,
            'state' => $this->party->getGameState(),
            'cups' => $cupsData
        ]);
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

        // player index in party
        $partyIndex = (int) $data['partyIndex'];

        $source = (int) $data['source'];
        $target = (int) $data['target'];
        $linesCount = (int) $data['linesCount'];

        Log::channel('socket')->info("add line", [
            'partyIndex' => $partyIndex,
            'source' => $source,
            'target' => $target,
            'linesCount' => $linesCount,
        ]);


        // here we need players for found the opponent and add line to him
        $players = $this->party->getPlayers();
        Log::channel('socket')->info("party", ['len' => count($players)]);

        // found opponent
        // todo: refactor it to index
        $opponent = $this->getOpponent($source);

        // send command to opponent
        if ($opponent) {
            $opponent->getConnection()->send(json_encode([
                // todo: use type from type
                'type' => static::MESSAGE_ADD_LINE,
                'source' => $source,
                'target' => $target,
                'linesCount' => $linesCount,
            ]));
        }

    }

    /**
     * @param ConnectionInterface $conn
     * @param array $data
     * @return void
     */
    private function processSendBonus (ConnectionInterface $conn, array $data): void
    {
        // send to target player
        // but, now we have two players and if it not a sender then it opponent

        // player index in party
        $partyIndex = (int) $data['partyIndex'];

        $source = (int) $data['source'];
        $target = (int) $data['target'];

        $bonus = BonusType::from((int) $data['bonus']);

        Log::channel('socket')->info("send bonus", [
            'partyIndex' => $partyIndex,
            'source' => $source,
            'target' => $target,
            'bonus' => $bonus,
        ]);

        // found opponent
        // todo: refactor it to index
        $opponent = $this->getOpponent($source);

        // send command to opponent
        if ($opponent) {
            $opponent->getConnection()->send(json_encode([
                'type' => ResponseType::getBonus,
                'source' => $source,
                'target' => $target,
                'bonus' => $bonus->value
            ]));
        }

    }

    /**
     * @param int $source
     * @return Player|null
     */
    private function getOpponent (int $source):? Player
    {
        // here we need players for found the opponent and add line to him
        $players = $this->party->getPlayers();
        // Log::channel('socket')->info("party", ['len' => count($players)]);

        // this is temporary code
        // we are searching opponent
        /** @var ConnectionInterface $opponentConnection */
        $opponentConnection = null;
        foreach ($players as $pIndex => $p) {
            if ($pIndex !== $source) {
                $opponentConnection = $p;
            }
        }

        return $opponentConnection;
    }


}
