<?php

namespace App\Sockets;

use App\Common\Helper;
use App\Common\Messages\BackToPartyMessage;
use App\Common\Messages\JoinToPartyMessage;
use App\Common\Messages\LetsPlayMessage;
use App\Common\PoolOfParties;
use App\Common\PoolOfPlayers;
use App\Common\Types\BonusType;
use App\Common\Types\CupState;
use App\Common\Types\MessageType;
use App\Common\Player;
use App\Common\Types\PartyType;
use App\Common\Types\ResponseType;
use Illuminate\Support\Facades\Log;
use Ratchet\ConnectionInterface;
use Ratchet\RFC6455\Messaging\MessageInterface;
use Ratchet\WebSocket\MessageComponentInterface;

class FirstTestSocket implements MessageComponentInterface
{

    /**
     * Pool of player for play
     */
    private PoolOfPlayers $playersPool;

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
        $this->info('Socket created');
        $this->partiesPool = new PoolOfParties();
        $this->playersPool = new PoolOfPlayers();
    }


    /**
     * @param ConnectionInterface $conn
     * @return void
     */
    public function onOpen(ConnectionInterface $conn): void
    {
        $this->info(__METHOD__);

        // generate socket is
        $conn->socketId = Helper::random();

        //
        $this->info(sprintf('Connection open with %s', $conn->socketId));

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
        $this->info(__METHOD__, ['socketId' =>  $conn->socketId]);

        // if connection was in search pool
        $this->playersPool->onConnectionClose($conn);

        // when connection closed we mark party as paused
        $party = $this->partiesPool->findPartyByPlayerId($conn->socketId);
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
//        $this->info('party AAAAA terminated');
//    }

    /**
     * @param ConnectionInterface $conn
     * @param \Exception $e
     * @return void
     */
    public function onError(ConnectionInterface $conn, \Exception $e): void
    {
        $this->info(__METHOD__);
        $this->info($e->getMessage());
    }

    /**
     * @param ConnectionInterface $conn
     * @param MessageInterface $msg
     * @return void
     */
    public function onMessage(ConnectionInterface $conn, MessageInterface $msg):void
    {
        $this->info(__METHOD__);

        $data = json_decode($msg->getPayload(), true);
        // $this->info("data", $data);

        if (empty($data['type'])) {
            $this->info("message.type is empty, ignore it");
            return;
        }

        $messageType = MessageType::from($data['type']);
        $this->info(sprintf("message.type = %s", $messageType->value));

        switch ($messageType) {
            // case MessageType::start: $this->processStartParty($conn, $data); break;
            case MessageType::join: $this->processJoinToParty($conn, $data); break;
            case MessageType::back: $this->processBackToParty($conn, $data); break;

            case MessageType::pause: $this->processPause($conn, $data); break;
            case MessageType::resume: $this->processResume($conn, $data); break;
            case MessageType::set: $this->processSet($conn, $data); break;
            // case MessageType::addLine: $this->processAddLine($conn, $data); break;
            case MessageType::sendBonus: $this->processSendBonus($conn, $data); break;
        }

        // deprecated method
//        if ($data['type'] == 'play' && !empty($data['cup']))
//        {
//            $this->info("type:play");
//            // $this->info("save", $data['cup']);
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
//            $this->info("type:watch");
//
//            // add connection to the party
//            $this->party[] = $conn;
//
//            $data = json_decode(Redis::get('cup'), true);
//            $this->info("watch", $data ?? []);
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
//        $this->info(__METHOD__);
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
        $this->info(__METHOD__);

        // in witch pool we should add user
        $pool = PartyType::from($data['partyType'] ?? 'duel');
        $this->info('connection added to '.$pool->value.' pool');

        // create message
        $m = (new JoinToPartyMessage())
            ->setPartyType($pool)
            ->setYourPlayerId($conn->socketId);

        // send answer to handshake with connection id
        $conn->send($m->getDataAsString());

        /**
         * @param ConnectionInterface[] $players
         * @return void
         */
        $onPoolReadyToMakeParty = function (array $players)
        {
            // create party
            $party = $this->partiesPool->createParty();
            $this->partiesPool->addParty($party);

            // move players to party
            foreach ($players as $p) $party->addPlayer($p);

            // run game
            // $this->party->setGameState(GameState::running);
            $party->setGameRunning();

            // create message
            $m = new LetsPlayMessage($party);
            $party->sendMessageToAllPlayers($m);
        };

        // add to pool
        if ($pool === PartyType::duel) $this->playersPool->addToDuels($conn, $onPoolReadyToMakeParty);
        if ($pool === PartyType::party) $this->playersPool->addToParty($conn, $onPoolReadyToMakeParty);
    }

    /**
     * @param ConnectionInterface $conn
     * @param array $data
     * @return void
     */
    private function processBackToParty(ConnectionInterface $conn, array $data)
    {
        $this->info(__METHOD__);

        $playerId = $data['playerId'];
        $partyId = $data['partyId'];
        $this->info('back to', ['partyId' => $partyId, 'playerId' => $playerId]);

        // response message
        $m = new BackToPartyMessage();

        $party = $this->partiesPool->getPartyById($partyId);
        if (!$party){
            $this->info('party not found');
            $m->partyNotFound('Party not found');
            $conn->send($m->getDataAsString());
            return;
        }

        // find play in the party
        $player = $party->findPlayerById($playerId);
        if (!$player){
            $this->info('Player not found in the party');
            $m->partyNotFound('Player not found in the party');
            $conn->send($m->getDataAsString());
            return;
        }

        // change socket id
        // $conn->socketId = $playerId;

        $this->info('party found');

        // todo: add log message
        // $party->addChatMessage();

        // return cups info
        $m->setCupsResponseData($party->getCupsResponse());

        //
        // it it not working because player has new socket id
        // and we do not have it in collection
        //
        //

        $this->info('party found');
        $party->sendMessageToAllPlayers($m);
    }

    /**
     * @param ConnectionInterface $conn
     * @param array $data
     * @return void
     */
    private function processPause(ConnectionInterface $conn, array $data): void
    {
        $this->info(__METHOD__);

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
        $this->info(__METHOD__);

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
     * @param ConnectionInterface $conn
     * @param array $data
     * @return void
     */
    private function processSet (ConnectionInterface $conn, array $data): void
    {
        // player index in party
//        if (!isset($data['partyIndex']) || $data['partyIndex'] == '') {
//            $this->info("Party index is not set, we ignore this set");
//            return;
//        }
//        $partyIndex = (int) $data['partyIndex'];
//        $this->info("partiIndex", ['partyIndex' => $partyIndex]);

        $partyId = (isset($data['partyId'])) ? $data['partyId'] : '';
        $playerId = (isset($data['playerId'])) ? $data['playerId'] : '';
        $this->info("set", ['partyId' => $partyId, 'playerId' => $playerId]);
        // $this->info("received", ['data.cup' => $data['cup']]);

        if (empty($partyId)){
            $this->info("Party id is empty, ignore request");
            return;
        }

        if (empty($playerId)){
            $this->info("Player id is empty, ignore request");
            return;
        }

        // global game state
//        $state = GameState::from($data['state']) ; // play, pause, game over, ets
//        $this->info("gameState", [$state]);

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
        // $this->info("response", ['cupsResponse' => $cupsResponse]);

        // preparing cup data
//        $cupsData = array_map(fn (Player $p) => $p->getCup()->createResponseData(), $this->party->getPlayers());
//        $this->info("response", ['cupsData' => $cupsData]);

        // $this->info("response", ['cups' => $cupsResponse]);
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
//        $this->info("add line", [
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
//        $this->info("party", ['len' => count($players)]);
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

        // party
        $partyId = $data['partyId'] ?? '';

        /**
         * Target player id
         */
        $target = $data['target'];

//        $sourceSocketId = $data['sourceSocketId'];
//        $targetSocketId = $data['targetSocketId'];

        $bonus = BonusType::from((int) $data['bonus']);

        // special situation split cup bonus
        if ($bonus == BonusType::switch) {
            $playerId = $data['playerId'];
            $this->info('process swith', ['data' => $data]);
            $this->processSwitchSpecial($partyId, $playerId, $target);
            return;
        }

        // add log

        // found opponent

        // pause game
        // $party = $this->party;
        $party = $this->partiesPool->getPartyById($partyId);

        $opponent = $party->findPlayerById($target);

        $this->info("send bonus", [
//            'partyIndex' => $partyIndex,
//            'source' => $source,
//            'connectionSocketId' => $conn->socketId,
//            'sourceSocketId' => $sourceSocketId,
//            'targetSocketId' => $targetSocketId,
            'opponent' => $opponent->getConnectionId(),
            'target' => $target,
            'bonus' => $bonus,
        ]);

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
     * This is process special block Switch
     * todo: simplify switch cups
     * @param string $partyId
     * @param string $sourcePlayerId
     * @param string $targetPlayerId
     * @return void
     */
    private function processSwitchSpecial(string $partyId, string $sourcePlayerId, string $targetPlayerId): void
    {
        $this->info(__METHOD__, ['partyId' => $partyId, 'sourcePlayerId' => $sourcePlayerId, 'targetPlayerId' => $targetPlayerId]);
        $party = $this->partiesPool->getPartyById($partyId);
        if (!$party) return;
        $this->info("party: ".$party->partyId);

        $sourcePlayer = $party->getPlayerById($sourcePlayerId);
        if (!$sourcePlayer) return;
        $this->info('source player: '.$sourcePlayer->getConnectionId());

        $targetPlayer = $party->getPlayerById($targetPlayerId);
        if (!$targetPlayer) return;
        $this->info('target: '.$targetPlayer->getConnectionId());

        // split cups
        $targetPlayerCup = $targetPlayer->getCup();

        $targetPlayer->setCup($sourcePlayer->getCup());
        $sourcePlayer->setCup($targetPlayerCup);

        $this->info('end switch');

        // send response to all
        $party->sendToAllPlayers([
            'type' => ResponseType::getBonus,
            // 'responsible' => $partyIndex,
            // 'responsibleId' => $conn->socketId
            'source' => $sourcePlayerId,
            'target' => $targetPlayer,
            'bonus' => BonusType::switch,
            'state' => $party->getGameState(),
            'cups' => $party->getCupsResponse()
        ]);

    }

    /**
     * @param string $playerId
     * @return Player|null
     */
//    private function findPlayerById (string $playerId):? Player
//    {
//        // here we need players for found the opponent and add line to him
//        $players = $this->party->getPlayers();
//        // $this->info("party", ['len' => count($players)]);
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

    /**
     * @param string $message
     * @param array $data
     * @return void
     */
    private function info (string $message, array $data = []) :void
    {
        Log::channel('socket')->info($message, $data);
    }

}
