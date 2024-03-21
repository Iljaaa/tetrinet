<?php

namespace App\Common;

use App\Common\Messages\Message;
use App\Common\Messages\UpdateChatMessage;
use App\Common\Types\GameState;
use App\Common\Types\PlayerState;
use Illuminate\Support\Facades\Log;
use Ratchet\ConnectionInterface;

/**
 * @version 0.1.3
 */
class Party
{
    /**
     * Party is generated when game starts
     * @var string
     */
    public string $partyId = '';

    /**
     * Global game state
     * @var GameState
     */
    private GameState $state = GameState::ready;

    /**
     * Player connections
     * where key id playerId aka socketId and value is a player
     * @var Player[]
     */
    private array $players = [];

    /**
     * @var array
     */
    private array $chat = [];

    /**
     * @var int
     */
    private int $speed = 1000;

    /*
     * Player cups
     * @var Cup[]
     */
    // public array $cups = [];

    /**
     *
     */
    public function __construct ()
    {
        // generate party id
        // $this->partyId = sprintf('%d.%d', random_int(1, 1000000000), random_int(1, 1000000000));
        $this->partyId = Helper::random();

        // add chat message
        $this->addChatMessage('Party created');

    }

    public function __destruct()
    {
        Log::channel('socket')->info('party '.$this->partyId.' terminated2222');
    }


    /**
     * Add player into party and return his index in
     * @param Player $p
     */
    public function addPlayer (Player $p): void
    {
        $this->players[$p->getConnectionId()] = $p;
        // return array_search($connection, $this->players);
    }

    /*
     * Is party has connection
     * @param ConnectionInterface $conn
     * @return bool

    public function isConnectionBelongs (ConnectionInterface $conn): bool
    {
        foreach ($this->players as $p) {
            if ($p->getConnectionId() == $conn->socketId) {
                return true;
            }
        }

        return false;
    }*/

    /**
     * Is player in this party
     * @param string $playerId
     * @return bool
     */
    public function isPartyHasPlayerById (string$playerId): bool
    {
        return array_key_exists($playerId, $this->players);
    }

    /**
     * @param string $playerId
     * @param array $cup cup info from request
     * @return void
     */
    public function updateCupByPlayerId(string $playerId, array $cup): void
    {
        // update cup data
        $this->players[$playerId]->updateCup($cup);
    }

    /**
     * Send data to all players
     * @param array $data
     * @return void
     */
//    public function sendToAllPlayers(array $data): void {
//        foreach ($this->players as $index => $p) {
//            $p->getConnection()->send(json_encode(array_merge($data, [
//                'yourIndex' => $index,
//                'partyId' => $this->partyId
//            ])));
//        }
//    }

    /**
     * Send data to all players
     * @param Message $m
     * @return void
     */
    public function sendMessageToAllPlayers(Message $m): void
    {
        // set chat from party to message
        // $m->setChat($this->chat);

        $mString = $m->getDataAsString();
        foreach ($this->players as $p) {
            $p->getConnection()->send($mString);
        }
    }

    /**
     * @return Player[]
     */
    public function getPlayers (): array {
        return $this->players;
    }

    /**
     * @param string $playerId
     * @return Player|null
     */
    public function getPlayerById (string $playerId): ?Player {
        return $this->players[$playerId] ?? null;
    }

    /**
     * Pause game
     * @return void
     */
    public function setPause ():void {
        $this->state = GameState::paused;
    }

    /**
     * Set game over state
     * @return void
     */
    public function setGameOver ():void {
        $this->state = GameState::over;
    }

    /**
     * Set game over state
     * @return void
     */
    public function setGameRunning ():void {
        $this->state = GameState::running;
    }

    /*
     * @param GameState $state
     * @return void
     */
//    public function setGameState(GameState $state): void {
//        $this->state = $state;
//    }

    /**
     * @param string $playerId
     * @return Player|null
     */
    public function findPlayerById (string $playerId):? Player
    {
        // here we need players for found the opponent and add line to him
        // $players = $this->party->getPlayers();
        // Log::channel('socket')->info("party", ['len' => count($players)]);

        // this is temporary code
        // we are searching opponent
//        $opponentConnection = null;
//        // foreach ($players as $pIndex => $p) {
//        foreach ($players as $p) {
//            if ($p->getConnectionId() === $playerId) {
//                $opponentConnection = $p;
//            }
//        }

        // return $opponentConnection;
        return $this->players[$playerId];
    }

    /**
     * @return GameState
     */
    public function getGameState(): GameState {
        return $this->state;
    }

    /**
     * Data for response to client
     * @return array
     */
    public function getCupsResponse (): array
    {
        return array_map(function (Player $p):array {
            return $p->getCup()->createResponseData();
        }, $this->players);
    }

    /**
     * @param string $message
     * @param string $playerName
     * @param string $playerId
     * @return void
     */
    public function addChatMessage (string $message, string $playerName = '', string $playerId = ''): void
    {
        if ($playerName == '') $playerName = 'System';
        $this->chat[] = new ChatMessage($message, $playerName, $playerId);
    }

    /**
     * Send chat to all players
     * @return void
     */
    public function sendChatToAllPlayers(): void
    {
        $this->sendMessageToAllPlayers(new UpdateChatMessage($this->partyId, $this->chat));
    }

    /**
     * Speed up cup
     * @return void
     */
    public function speedUp(): void
    {
        if ($this->speed >= 200) {
            $this->speed -= 50;
        }
    }

    public function getSpeed(): int
    {
        return $this->speed;
    }

    /*
     * @return array
     */
//    public function getChat (): array
//    {
//        return $this->chat;
//    }

    /*
     * @return array
     */
//    public function getChatAssArray(): array
//    {
//        return array_map(fn (ChatMessage $m) => $m->asArray(), $this->chat);
//    }

}
