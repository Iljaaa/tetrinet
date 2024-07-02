<?php

namespace App\Actions;

use App\Actions\Messages\BackToParty;
use App\Actions\Messages\ChatMessage;
use App\Actions\Messages\JoinToParty;
use App\Actions\Messages\LeaveParty;
use App\Actions\Messages\Pause;
use App\Actions\Messages\Resume;
use App\Actions\Messages\SendBonus;
use App\Actions\Messages\SetCup;
use app\Actions\Messages\SpeedUp;
use App\Common\SocketLogTrait;
use App\Common\Types\MessageType;
use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Contracts\PoolOfPlayers;
use Domain\Game\Exceptions\DomainException;
use Domain\Game\ValueObjects\Connection;
use Ratchet\RFC6455\Messaging\MessageInterface;

/**
 * Action when we receive new message from socket
 */
class OnMessage
{
    use SocketLogTrait;

    public function __construct(
        private readonly PoolOfPlayers $playersPool,
        private readonly PoolOfParties $partiesPool,
    ){}

    /**
     * @param Connection $connection
     * @param MessageInterface $msg
     * @return void
     * @throws DomainException
     */
    public function handle(Connection $connection, MessageInterface $msg): void
    {
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
            case MessageType::join:
                (new JoinToParty($this->playersPool, $this->partiesPool))($connection ,$data);break;
            case MessageType::back:
                // $this->processBackToParty($connection, $data); break;
                (new BackToParty($this->partiesPool))($connection, $data); break;
            case MessageType::leave:
                // $this->processLeaveToParty($connection, $data); break;
                (new LeaveParty($this->partiesPool))($connection, $data); break;
            case MessageType::pause:
                // $this->processPause($connection, $data); break;
                (new Pause($this->partiesPool))($connection, $data);
                break;
            case MessageType::resume:
                // $this->processResume($connection, $data); break;
                (new Resume($this->partiesPool))($connection, $data);
                break;
            case MessageType::set:
                // $this->processSet($connection, $data); break;
                (new SetCup($this->partiesPool))($data);
                break;
            // case MessageType::addLine: $this->processAddLine($conn, $data); break;
            case MessageType::sendBonus:
                // $this->processSendBonus($connection, $data); break;
                (new SendBonus($this->partiesPool))($data);
                break;
            case MessageType::chatMessage:
                // $this->processChatMessage($connection, $data); break;
                (new ChatMessage($this->partiesPool))($data);
                break;
            case MessageType::speedUp:
                // $this->processSpeedUpMessage($connection, $data); break;
                (new SpeedUp($this->partiesPool))($data);
                break;
        }
    }


    /*
     * Join to party
     * @param Connection $conn
     * @param array $data
     * @return void
     */
//    private function processJoinToParty (Connection $conn, array $data): void
//    {
//        $this->info(__METHOD__);
//
//        // in witch pool we should add user
//        $pool = PartyType::from($data['partyType'] ?? 'duel');
//        $playerName = trim($data['playerName']);
//        $this->info('get request to add in pull', ['pool' => $pool->value, 'socketId' => $conn->getSocketId(), 'playerName' => $playerName]);
//
//        // create new player
//        $p = new Player($conn, $playerName);
//
//        // create handshake message
//        $m = (new JoinToPartyMessage())
//            ->setPartyType($pool)
//            ->setYourPlayerId($p->getConnectionId());
//
//        // send answer to handshake with connection id
//        $p->getConnection()->send($m->getDataAsString());
//
//        /**
//         * @param Player[] $players
//         * @return void
//         */
//        $onPoolReadyToMakeParty = function (array $players)
//        {
//            // create party
//            $party = $this->partiesPool->createParty();
//
//            //
//            $this->partiesPool->addParty($party);
//
//            // move players to party
//            foreach ($players as $p) $party->addPlayer($p);
//
//            // choose host
//            // $party->setHost();
//
//            // run game
//            // $this->party->setGameState(GameState::running);
//            $party->setGameRunning();
//
//            // create message
//            $m = new LetsPlayMessage($party);
//            $party->sendMessageToAllPlayers($m);
//
//            // send chat message to all
//            $party->sendChatToAllPlayers();
//
//        };
//
//        // add player to pool
//        $this->playersPool->addPlayerToPull($pool, $p, $onPoolReadyToMakeParty);
//        // if ($pool === PartyType::duel) $this->playersPool->addToDuels($p, $onPoolReadyToMakeParty);
//        // if ($pool === PartyType::party) $this->playersPool->addToParty($p, $onPoolReadyToMakeParty);
//    }

    /*
     * @param Connection $conn
     * @param array $data
     * @return void
     */
//    private function processBackToParty(Connection $conn, array $data)
//    {
//        $this->info(__METHOD__);
//
//        $playerId = $data['playerId'];
//        $partyId = $data['partyId'];
//        $this->info('back to', ['partyId' => $partyId, 'playerId' => $playerId]);
//
//        // response message
//        $m = new BackToPartyMessage();
//
//        $party = $this->partiesPool->getPartyById($partyId);
//        if (!$party){
//            $this->info('party not found');
//            $m->partyNotFound('Party not found');
//            $conn->send($m->getDataAsString());
//            return;
//        }
//
//        // find play in the party
//        $player = $party->findPlayerById($playerId);
//        if (!$player){
//            $this->info('Player not found in the party');
//            $m->partyNotFound('Player not found in the party');
//            $conn->send($m->getDataAsString());
//            return;
//        }
//
//        // change socket id
//        // $conn->socketId = $playerId;
//
//        $this->info('party found');
//
//        // todo: add log message
//        // $party->addChatMessage();
//
//        // return cups info
//        $m->setCupsResponseData($party->getCupsResponse());
//
//        //
//        // it it not working because player has new socket id
//        // and we do not have it in collection
//        //
//        //
//
//        $this->info('party found');
//        $party->sendMessageToAllPlayers($m);
//    }

    /*
     * @param Connection $conn
     * @param array $data
     * @return void
     */
//    private function processLeaveToParty(Connection $conn, array $data)
//    {
//        $this->info(__METHOD__);
//
//        $playerId = $data['playerId'] ?? '';
//        $partyId = $data['partyId'] ?? '';
//        $this->info('leave', ['partyId' => $partyId, 'playerId' => $playerId]);
//
//        $party = $this->partiesPool->getPartyById($partyId);
//        if (!$party) return;
//
//        // find player in the party
//        $player = $party->findPlayerById($playerId);
//        if (!$player) return;
//
//        // mark player as offline
//        $player->setOffline();
//
//        // set cup as over
//        $player->getCup()->setCupAsOver();
//
//        // notify users about
//        $party->addChatMessage(sprintf('Player __%s__ leave the game', $player->getName()));
//        $party->sendChatToAllPlayers();
//
//        // detect end game
//        $this->determineGameOverInSet($party);
//    }

    /*
     * @param Connection $conn
     * @param array $data
     * @return void
     */
//    private function processPause(Connection $conn, array $data): void
//    {
//        $this->info(__METHOD__);
//
//        $partyId = $data['partyId'] ?? '';
//        if (!$partyId) return;
//
//        // pause game
//        $party = $this->partiesPool->getPartyById($partyId);
//        if (!$party) return;
//
//        /** @var Player $player */
//        $player = $party->getPlayerById($conn->getSocketId());
//        if (!$player) return;
//
//        //
//        if ($player->getPauses() <= 0) return;
//
//        // set pause
//        $party->setPause();
//
//        // decrease user pauses count
//        $player->decreasePause();;
//
//        //
//        $party->sendMessageToAllPlayers(new PausedMessage($party));
//
//        // send chat message
//        $intent = $data['intent'] ?? '';
//        $s = ($intent)
//            ? sprintf('Player __%s__ paused the game, because: %s. Left: %d', $player->getName(), $intent, $player->getPauses())
//            : sprintf('Player __%s__ paused the game. Left: %d', $player->getName(), $player->getPauses());
//        $party->addChatMessage($s);
//        $party->sendChatToAllPlayers();
//
//    }

    /*
     * @param Connection $conn
     * @param array $data
     * @return void
     */
//    private function processResume(Connection $conn, array $data): void
//    {
//        $this->info(__METHOD__);
//
//        $partyId = $data['partyId'] ?? '';
//
//        // resume game
//        $party = $this->partiesPool->getPartyById($partyId);
//        $party->setGameRunning();
//
//
//        $party->sendMessageToAllPlayers(new ResumeMessage($party));
//
//        // send chat message
//        /** @var Player $player */
//        $player = $party->getPlayerById($conn->getSocketId());
//        $intent = $data['intent'] ?? '';
//        $s = ($intent)
//            ? sprintf('Player __%s__ resumed the game because: %s', $player->getName(), $intent)
//            : sprintf('Player __%s__ resumed the game', $player->getName());
//        $party->addChatMessage($s);
//        $party->sendChatToAllPlayers();
//    }

    /*
     * @param Connection $conn
     * @param array $data
     * @return void
     */
//    private function processSet (Connection $conn, array $data): void
//    {
//        $partyId = (isset($data['partyId'])) ? $data['partyId'] : '';
//        $playerId = (isset($data['playerId'])) ? $data['playerId'] : '';
//        $this->info("set", [
//            'partyId' => $partyId,
//            'playerId' => $playerId
//        ]);
//        // $this->info("received", ['data.cup' => $data['cup']]);
//
//        if (empty($partyId)) {
//            $this->info("Party id is empty, ignore request");
//            return;
//        }
//
//        if (empty($playerId)){
//            $this->info("Player id is empty, ignore request");
//            return;
//        }
//
//        $party = $this->partiesPool->getPartyById($partyId);
//        if (!$party) {
//            $this->info(sprintf('Party %s not found', $partyId));
//            return;
//        }
//
//        //
//        $cupData = $data['cup'] ?? null;
//        if (!$cupData){
//            $this->info('Cup data not received');
//            return;
//        }
//
//        // save cup info
//        $party->updateCupByPlayerId($playerId, $data['cup']);
//
//        // try to determine game over
//        $this->determineGameOverInSet($party);
//
//        // todo: may be we should refactor this method and send only one cup instead of all party
//        $party->sendMessageToAllPlayers(new AfterSetMessage($party));
//    }

    /*
     * @deprecated this method should be in tha party
     * check and set game over
     * @param Party $party
     * @return void
     */
//    private function determineGameOverInSet(Party $party): void
//    {
//        if (!in_array($party->getGameState(), [GameState::running, GameState::paused])){
//            return;
//        }
//
//        // check game over
//        $activeCups = array_filter($party->getPlayers(), fn(Player $p) => $p->getCup()->getState() == CupState::online);
//
//        // this is global game over
//        if (count($activeCups) <= 1)
//        {
//            // $this->party->setGameState(GameState::over);
//            $party->setGameOver();
//
//            // mar winner
//            $winner = null;
//            foreach ($party->getPlayers() as $p) {
//                if ($p->getCup()->getState() == CupState::online) {
//                    $winner = $p;
//                    $winner->getCup()->setCupAsWinner();
//                    break;
//                }
//            }
//
//            $party->addChatMessage(sprintf('End of the game, winner: __%s__', $winner->getName()));
//            $party->sendChatToAllPlayers();
//
//            // inform all players
//            $party->sendMessageToAllPlayers(new GameOverMessage($party));
//        }
//
//    }

    /*
     * @param Connection $conn
     * @param array $data
     * @return void
     */
//    private function processSendBonus (Connection $conn, array $data): void
//    {
//        // send to target player
//        // but, now we have two players and if it not a sender then it opponent
//
//        // player index in party
//        // $partyIndex = (int) $data['partyIndex'];
//
//        /**
//         */
//        // $source = (int) $data['source'];
//
//        // party
//        $partyId = $data['partyId'] ?? '';
//
//        /**
//         * Target player id
//         */
//        $target = $data['target'];
//        $playerId = $data['playerId'];
//
////        $sourceSocketId = $data['sourceSocketId'];
////        $targetSocketId = $data['targetSocketId'];
//
//        $bonus = BonusType::from((int) $data['bonus']);
//
//        // special situation split cup bonus
//        if ($bonus == BonusType::switch) {
//            $this->info('process switch', ['data' => $data]);
//            $this->processSwitchSpecial($partyId, $playerId, $target);
//            return;
//        }
//
//        // add log
//
//        // found opponent
//
//        // pause game
//        // $party = $this->party;
//        $party = $this->partiesPool->getPartyById($partyId);
//
//        $player = $party->getPlayerById($playerId);
//        $opponent = $party->getPlayerById($target);
//
//        $this->info("send bonus", [
//            'opponent' => $opponent->getConnection()->getSocketId(),
//            'target' => $target,
//            'bonus' => $bonus,
//        ]);
//
//        // send command to opponent
//        // todo: think about chat may be we should create stand alone message
//        if ($opponent) {
//            $opponent->getConnection()->send(json_encode([
//                'type' => ResponseType::getBonus,
//                'source' => $conn->getSocketId(),
//                'target' => $target,
//                'bonus' => $bonus->value
//            ]));
//        }
//
//        // add message
//        $party->addChatMessage(sprintf('Player __%s__ sent __%s__ to __%s__', $player->getName(),  Helper::GetNiceBlockName($bonus), $opponent->getName()));
//        $party->sendChatToAllPlayers();
//    }

    /*
     * This is process special block Switch
     * @param string $partyId
     * @param string $sourcePlayerId
     * @param string $targetPlayerId
     * @return void
     */
//    private function processSwitchSpecial(string $partyId, string $sourcePlayerId, string $targetPlayerId): void
//    {
//        $this->info(__METHOD__, ['partyId' => $partyId, 'sourcePlayerId' => $sourcePlayerId, 'targetPlayerId' => $targetPlayerId]);
//        $party = $this->partiesPool->getPartyById($partyId);
//        if (!$party) return;
//        // $this->info("party: ".$party->partyId);
//
//        $sourcePlayer = $party->getPlayerById($sourcePlayerId);
//        if (!$sourcePlayer) return;
//        // $this->info('source player: '.$sourcePlayer->getConnectionId());
//
//        $targetPlayer = $party->getPlayerById($targetPlayerId);
//        if (!$targetPlayer) return;
//        // $this->info('target: '.$targetPlayer->getConnectionId());
//
//        // split cups
//        $targetPlayerCup = $targetPlayer->getCup();
//
//        $targetPlayer->setCup($sourcePlayer->getCup());
//        $sourcePlayer->setCup($targetPlayerCup);
//
//        $m = new SwitchCupsMessage($party);
//
//        // sens new cup to target player
//        $m->setSwitchData($targetPlayerId, $sourcePlayerId, $targetPlayer->getCup());
//        $targetPlayer->getConnection()->send($m->getDataAsString());
//
//        // sens new cup to target player
//        $m->setSwitchData($targetPlayerId, $sourcePlayerId, $sourcePlayer->getCup());
//        $sourcePlayer->getConnection()->send($m->getDataAsString());
//
//        // send message to chat
//        $party->addChatMessage(sprintf('Player __%s__ switch cup with __%s__', $sourcePlayer->getName(), $targetPlayer->getName()));
//        $party->sendChatToAllPlayers();
//    }

    /*
     * Process chat message
     * @param Connection $conn
     * @param array $data
     * @return void
     */
//    private function processChatMessage(Connection $conn, array $data): void
//    {
//        // party
//        $partyId = $data['partyId'] ?? '';
//        if (!$partyId) return;
//        $party = $this->partiesPool->getPartyById($partyId);
//        if (!$party) return;
//
//
//        // player
//        $playerId = $data['playerId'] ?? '';
//        if (!$playerId) return;
//        $player = $party->findPlayerById($playerId);
//        if (!$player) return;
//
//        $this->info('new chat message', [
//            'partyId' => $partyId,
//            'playerId' => $playerId
//        ]);
//
//        $message = $data['message'] ?? '';
//
//        // add message
//        $party->addChatMessage($message, $player->getName(), $playerId);
//        $party->sendChatToAllPlayers();
//    }

    /*
     * Process chat message
     * @param Connection $conn
     * @param array $data
     * @return void
     */
//    private function processSpeedUpMessage(Connection $conn, array $data): void
//    {
//
//        $this->info('data from speed up request', $data);
//
//        // party
//        $partyId = $data['partyId'] ?? '';
//        if (!$partyId) return;
//
//        $party = $this->partiesPool->getPartyById($partyId);
//        if (!$party) return;
//
//        $newSpeed = $data['speed'] ?? null;
//        if ($newSpeed === null) {
//            $this->error('speed not received from request');
//            return;
//        }
//
//        // increase speed
//        // $party->speedUp();
//        if (!$party->setSpeed($newSpeed)){
//            $this->info('speed was not updated, ignore it');
//            return;
//        }
//
//        // player
////        $playerId = $data['playerId'] ?? '';
////        if (!$playerId) return;
////        $player = $party->findPlayerById($playerId);
////        if (!$player) return;
//
//        $this->info('speed up', [
//            'partyId' => $partyId,
//            'speed' => $party->getSpeed()
//        ]);
//
//        $m = sprintf('Speed has increased to: %s', $party->getSpeed());
//
//        $party->addChatMessage($m);
//        $party->sendChatToAllPlayers();
//
//        $party->sendMessageToAllPlayers(new SpeedupMessage($party, $party->getSpeed()));
//
//    }
}