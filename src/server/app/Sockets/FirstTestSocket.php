<?php

namespace App\Sockets;

use App\Common\Helper;
use App\Common\PoolOfParties;
use App\Common\Types\BonusType;
use App\Common\Types\CupState;
use App\Common\Types\MessageType;
use App\Common\Player;
use App\Common\Types\ResponseType;
use Illuminate\Support\Facades\Log;
use Ratchet\ConnectionInterface;
use Ratchet\RFC6455\Messaging\MessageInterface;
use Ratchet\WebSocket\MessageComponentInterface;

class FirstTestSocket implements MessageComponentInterface
{

    /**
     * Pool of player for play
     * @var ConnectionInterface[]
     */
    private array $duelPlayersPool = [];

    /*
     * This is play party
     * @var Party|null
     */
    // private Party|null $party = null;

    /**
     * This is pool of parties
     */
    // private Party|null $party = null;
    private PoolOfParties $partiesPool;

    /**
     *
     */
    public function __construct()
    {
        $this->partiesPool = new PoolOfParties();
    }


    /**
     * @param ConnectionInterface $conn
     * @return void
     */
    public function onOpen(ConnectionInterface $conn): void
    {
        Log::channel('socket')->info(__METHOD__);

        // generate socket is
        $conn->socketId = Helper::random();

        //
        Log::channel('socket')->info(sprintf('Connection open with %s', $conn->socketId));

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
        // todo: refactor to socketId
        $index = array_search($conn, $this->duelPlayersPool);
        if ($index > -1) {
            Log::channel('socket')->info('connection found in duel pull', ['index' => $index, 'size' => count($this->duelPlayersPool)]);
            // filter from pool out connection
            $this->duelPlayersPool = array_filter($this->duelPlayersPool, fn (ConnectionInterface $c) =>  $c != $conn);
            Log::channel('socket')->info('after filter', ['size' => count($this->duelPlayersPool)]);
        }

        // when connection closed we mark party as paused
        $party = $this->partiesPool->findPartyByPlayerId($conn->socketId);
        // $party = $this->party;
        // if ($party && $party->isConnectionBelongs($conn))
        if ($party)
        {
            // set party on pause
            $party->setPause();
            $party->sendToAllPlayers([
                'type' => ResponseType::paused,
                'initiator' => $conn->socketId,
                'state' => $party->getGameState()
            ]);

            // todo: add log

            // mark in party that user lost connection
            $party->onConnectionClose($conn, function () use ($party)
            {
                // this is new method
                $this->partiesPool->terminatePartyByPartyId($party->partyId);

                // old close party method
                // $this->onAllPlayersOffline();
            });
        }
    }

    /**
     * this is callback method when all players leave the party and it destoyed
     * @return void
     */
//    private function onAllPlayersOffline(): void
//    {
//        // $party = $this->party;
//
//        // close party
//        // $partyId = $party->partyId;
//
//        // clear party
//        $this->party = null;
//
//        Log::channel('socket')->info('party AAAAA terminated');
//    }

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
            // case MessageType::start: $this->processStartParty($conn, $data); break;
            case MessageType::join: $this->processJoinToParty($conn, $data); break;
            case MessageType::pause: $this->processPause($conn, $data); break;
            case MessageType::resume: $this->processResume($conn, $data); break;
            case MessageType::set: $this->processSet($conn, $data); break;
            // case MessageType::addLine: $this->processAddLine($conn, $data); break;
            case MessageType::sendBonus: $this->processSendBonus($conn, $data); break;
        }

        // deprecated method
//        if ($data['type'] == 'play' && !empty($data['cup']))
//        {
//            Log::channel('socket')->info("type:play");
//            // Log::channel('socket')->info("save", $data['cup']);
//
//            // add connection to the party
//            $this->party[] = $conn;
//
//            // store cup into redis
//            // todo here we need to clear cup
//            Redis::set('cup', json_encode($data['cup']));
//
//            // todo: generate and return id in the party
//            $conn->send(json_encode([
//                'response' => 'Thanx save'
//            ]));
//        }

        // we start watching
//        if ($data['type'] == 'watch')
//        {
//            Log::channel('socket')->info("type:watch");
//
//            // add connection to the party
//            $this->party[] = $conn;
//
//            $data = json_decode(Redis::get('cup'), true);
//            Log::channel('socket')->info("watch", $data ?? []);
//
//            $conn->send(json_encode([
//                'cup' => $data
//            ]));
//        }
    }

    /*
     * @deprecated
     * Create new party and add itself to this
     * @param ConnectionInterface $connection
     * @param array $data
     * @return void
     */
//    private function processStartParty (ConnectionInterface $connection, array $data):void
//    {
//        Log::channel('socket')->info(__METHOD__);
//
//        // create party id
//        $party = new Party();
//        $this->party = $party;
//
//        //
//        $connection->send(json_encode([
//            'partyId' => $party->partyId,
//            'yourIndex' => 0,
//        ]));
//    }

    /**
     * Join to party
     * @param ConnectionInterface $conn
     * @param array $data
     * @return void
     */
    private function processJoinToParty (ConnectionInterface $conn, array $data): void
    {
        Log::channel('socket')->info(__METHOD__);

        // todo: check type of game and move to this pull
        // add player to pool
        $this->duelPlayersPool[] = $conn;
        Log::channel('socket')->info('connection added to duel pool', ['poolSize' => count($this->duelPlayersPool)]);

        // send answer to handshake with connection id
        $conn->send(json_encode([
            'yourSocketId' => $conn->socketId
        ]));


        // only two players and the pull is full
        if (count($this->duelPlayersPool) >= 2)
        {
            // $party = new Party();
            $party = $this->partiesPool->createParty();
            $this->partiesPool->addParty($party);

            // $this->party = $party;

            // move players to party
            foreach ($this->duelPlayersPool as $p) {
                $party->addPlayer($p);
            }

            // clean up pull
            // todo: may be remove only added connections
            $this->duelPlayersPool = [];

            // run game
            // $this->party->setGameState(GameState::running);
            $party->setGameRunning();

            //
            $partyResponse = [];
            foreach ($party->getPlayers() as $p) {
                $partyResponse[] = [
                    'socketId' => $p->getConnectionId(),
                    // 'name' => '' this is musk be player name
                ];
            }

            // send to all players information that game starts
            $party->sendToAllPlayers([
                'type' => ResponseType::letsPlay,
                'party' => $partyResponse // this is party description
            ]);
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

        $partyId = $data['partyId'] ?? '';

        // pause game
        // $party = $this->party;
        $party = $this->partiesPool->getPartyById($partyId);
        $party->setPause();
        // $this->party->setGameState(GameState::paused);

        // todo: add log message

        // send data to all connections
        $party->sendToAllPlayers([
            'type' => ResponseType::paused,
            'state' => $party->getGameState(),
        ]);
    }

    /**
     * @param ConnectionInterface $conn
     * @param array $data
     * @return void
     */
    private function processResume(ConnectionInterface $conn, array $data): void
    {
        Log::channel('socket')->info(__METHOD__);

        $partyId = $data['partyId'] ?? '';

        // pause game
        // $party = $this->party;
        $party = $this->partiesPool->getPartyById($partyId);

        // back to running
        // $this->party->setGameState(GameState::running);
        // $party = $this->party;
        $party->setGameRunning();

        // todo: add log message

        // send data to all connections
        $party->sendToAllPlayers([
            'type' => ResponseType::resumed,
            'state' => $party->getGameState(),
        ]);
    }

    /**
     * todo: refactor
     * @param ConnectionInterface $conn
     * @param array $data
     * @return void
     */
    private function processSet (ConnectionInterface $conn, array $data): void
    {
        // player index in party
//        if (!isset($data['partyIndex']) || $data['partyIndex'] == '') {
//            Log::channel('socket')->info("Party index is not set, we ignore this set");
//            return;
//        }
//        $partyIndex = (int) $data['partyIndex'];
//        Log::channel('socket')->info("partiIndex", ['partyIndex' => $partyIndex]);

        $partyId = (isset($data['partyId'])) ? $data['partyId'] : '';
        $playerId = (isset($data['playerId'])) ? $data['playerId'] : '';
        Log::channel('socket')->info("set", ['partyId' => $partyId, 'playerId' => $playerId]);

        if (empty($partyId)){
            Log::channel('socket')->info("Party id is empty, ignore request");
            return;
        }

        if (empty($playerId)){
            Log::channel('socket')->info("Player id is empty, ignore request");
            return;
        }

        // global game state
//        $state = GameState::from($data['state']) ; // play, pause, game over, ets
//        Log::channel('socket')->info("gameState", [$state]);

        // $partyId = $data['partyId'] ?? '';

        // pause game
        // $party = $this->party;
        $party = $this->partiesPool->getPartyById($partyId);

        // save cup info
        $party->updateCupByPlayerId($playerId, $data['cup']);

        // check game over
        $activeCups = array_filter($party->getPlayers(), fn(Player $p) => $p->getCup()->state == CupState::online);

        // this is global game over
        if (count($activeCups) <= 1)
        {
            // $this->party->setGameState(GameState::over);
            $party->setGameOver();

            // mar winner
            foreach ($party->getPlayers() as $p) {
                if ($p->getCup()->state == CupState::online) {
                    $p->getCup()->setCupAsWinner();
                    break;
                }
            }
        }

        //
        $cupsResponse = $party->getCupsResponse();
        Log::channel('socket')->info("response2", ['cupsResponse' => $cupsResponse]);

        // preparing cup data
//        $cupsData = array_map(fn (Player $p) => $p->getCup()->createResponseData(), $this->party->getPlayers());
//        Log::channel('socket')->info("response", ['cupsData' => $cupsData]);

        // send data to all players
        $party->sendToAllPlayers([
            'type' => ResponseType::afterSet,
            // 'responsible' => $partyIndex,
            // 'responsibleId' => $conn->socketId
            'state' => $party->getGameState(),
            'cups' => $cupsResponse
        ]);
    }

    /*
     * @deprecated
     * @param ConnectionInterface $conn
     * @param array $data
     * @return void
     */
//    private function processAddLine (ConnectionInterface $conn, array $data): void
//    {
//        // send to target player
//        // but, now we have two players and if it not a sender then it opponent
//
//        // player index in party
//        // $partyIndex = (int) $data['partyIndex'];
//
//        $source = (int) $data['source'];
//        $target = (int) $data['target'];
//        $linesCount = (int) $data['linesCount'];
//
//        Log::channel('socket')->info("add line", [
//            // 'partyIndex' => $partyIndex,
//            'source' => $source,
//            'sourceId' => $conn->socketId,
//            'target' => $target,
//            'linesCount' => $linesCount,
//        ]);
//
//
//        // here we need players for found the opponent and add line to him
//        $players = $this->party->getPlayers();
//        Log::channel('socket')->info("party", ['len' => count($players)]);
//
//        // found opponent
//        $opponent = $this->findPlayerById($source);
//
//        // send command to opponent
//        if ($opponent) {
//            $opponent->getConnection()->send(json_encode([
//                'type' => ResponseType::addLine,
//                'source' => $source, // todo: remake source to socket id
//                'sourceId' => $conn->socketId,
//                'target' => $target,
//                'linesCount' => $linesCount,
//            ]));
//        }
//    }

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
        // $partyIndex = (int) $data['partyIndex'];

        /**
         */
        // $source = (int) $data['source'];

        /**
         * Target player id
         */
        $target = $data['target'];

//        $sourceSocketId = $data['sourceSocketId'];
//        $targetSocketId = $data['targetSocketId'];

        $bonus = BonusType::from((int) $data['bonus']);

        // add log

        // found opponent
        // $opponent = $this->findPlayerById($target);
        $partyId = $data['partyId'] ?? '';

        // pause game
        // $party = $this->party;
        $party = $this->partiesPool->getPartyById($partyId);

        $opponent = $party->findPlayerById($target);

        Log::channel('socket')->info("send bonus", [
//            'partyIndex' => $partyIndex,
//            'source' => $source,
//            'connectionSocketId' => $conn->socketId,
//            'sourceSocketId' => $sourceSocketId,
//            'targetSocketId' => $targetSocketId,
            'opponent' => $opponent->getConnectionId(),
            'target' => $target,
            'bonus' => $bonus,
        ]);

        // todo: add modal

        // send command to opponent
        if ($opponent) {
            $opponent->getConnection()->send(json_encode([
                'type' => ResponseType::getBonus,
                'source' => $conn->socketId,
                'target' => $target,
                'bonus' => $bonus->value
            ]));
        }
    }

    /**
     * @param string $playerId
     * @return Player|null
     */
//    private function findPlayerById (string $playerId):? Player
//    {
//        // here we need players for found the opponent and add line to him
//        $players = $this->party->getPlayers();
//        // Log::channel('socket')->info("party", ['len' => count($players)]);
//
//        // this is temporary code
//        // we are searching opponent
//        /** @var ConnectionInterface $opponentConnection */
//        $opponentConnection = null;
//        // foreach ($players as $pIndex => $p) {
//        foreach ($players as $p) {
//            if ($p->getConnectionId() === $playerId) {
//                $opponentConnection = $p;
//            }
//        }
//
//        return $opponentConnection;
//    }


}
