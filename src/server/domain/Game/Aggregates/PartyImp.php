<?php

namespace Domain\Game\Aggregates;

use App\Common\ChatMessage;
use App\Common\ResponseMessages\GameOverMessage;
use App\Common\ResponseMessages\Message;
use App\Common\ResponseMessages\UpdateChatMessage;
use Domain\Game\Contracts\Party;
use Domain\Game\Entities\Player;
use Domain\Game\Enums\CupState;
use Domain\Game\Enums\GameState;

/**
 * @version 0.1.3
 */
class PartyImp implements Party
{
    /**
     * Party is generated when game starts
     * @var string
     */
    // private string $partyId = '';

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
     * todo: remove chat from this object
     * @var array
     */
    private array $chat = [];

    /**
     * @var int
     */
    private int $speed = 0;

    /*
     * Player cups
     * @var Cup[]
     */
    // public array $cups = [];

    /**
     * @param string $partyId
     */
    public function __construct(private readonly string $partyId)
    {
        // add chat message
        // fixme: and this not S from solid
        $this->addChatMessage(sprintf('Party %s created', $this->getId()));
    }

    public function getId(): string
    {
        return $this->partyId;
    }


//    public function __destruct()
//    {
//        // Log::channel('socket')->info('party '.$this->partyId.' terminated');
//    }


    /**
     * Add player into party and return his index in
     * @param Player $p
     */
    public function addPlayer (Player $p): void
    {
        $this->players[$p->getId()] = $p;
        // $this->players[$p->getConnection()->getSocketId()] = $p;
        // return array_search($connection, $this->players);
    }

    /**
     * Set part host who will check the speed
     * @return void
     */
//    public function setHost()
//    {
//        //
//    }

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
     * todo: rename it to isPlayerExists
     * @param string $playerId
     * @return bool
     */
    public function isPartyHasPlayerById(string $playerId): bool
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
     * todo: this method must be in action
     * Send data to all players
     * @param Message $m
     * @return void
     */
    public function sendMessageToAllPlayers(Message $m): void
    {
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

    /**
     * @param string $playerId
     * @return Player|null
     */
    public function getPlayerById (string $playerId): ?Player {
        return $this->players[$playerId] ?? null;
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
        $this->sendMessageToAllPlayers(new UpdateChatMessage($this->getId(), $this->chat));
    }

    /**
     * Speed up cup
     * @return bool was speed updated
     */
    public function setSpeed(int $speed): bool
    {
        if ($this->speed < $speed){
            $this->speed = $speed;
            return true;
        }

        return false;
    }

    public function getSpeed(): int
    {
        return $this->speed;
    }


    /**
     * Here we check end of the game
     * todo: add callback tat party is ends and move there add chat message
     * @return void
     */
    public function determineGameOverInSetItOver (): void
    {
        //
        if (!in_array($this->getGameState(), [GameState::running, GameState::paused])){
            return;
        }

        // check players with active cups
        $activeCups = array_filter($this->getPlayers(), fn(Player $p) => $p->getCup()->getState() == CupState::online);

        // this is global game over
        if (count($activeCups) <= 1)
        {
            // $this->party->setGameState(GameState::over);
            $this->setGameOver();

            // searching winner
            $winner = null;
            foreach ($this->getPlayers() as $p) {
                if ($p->getCup()->getState() == CupState::online) {
                    $winner = $p;
                    $winner->getCup()->setCupAsWinner();
                    break;
                }
            }

            // this must be in callback
            $this->addChatMessage(sprintf('End of the game, winner: __%s__', $winner->getName()));
            $this->sendChatToAllPlayers();

            // inform all players
            $this->sendMessageToAllPlayers(new GameOverMessage($this));
        }
    }

}
