<?php

namespace App\Common;

use App\Common\Types\PlayerState;
use Ratchet\ConnectionInterface;

/**
 * @version 0.0.2
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
    }

    /**
     * Add player into party and return his index in
     * @param ConnectionInterface $conn
     */
    public function addPlayer (ConnectionInterface $conn): void
    {
        $this->players[$conn->socketId] = new Player($conn);
        // return array_search($connection, $this->players);
    }

    /**
     * Is party has connection
     * @param ConnectionInterface $conn
     * @return bool
     */
    public function isConnectionBelongs (ConnectionInterface $conn): bool
    {
        foreach ($this->players as $p) {
            if ($p->getConnectionId() == $conn->socketId) {
                return true;
            }
        }

        return false;
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
    public function sendToAllPlayers(array $data): void {
        foreach ($this->players as $index => $p) {
            // if ($p->)
            $p->getConnection()->send(json_encode(array_merge($data, [
                'yourIndex' => $index,
                'partyId' => $this->partyId
            ])));
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
        $this->state = GameState::over;
    }

    /*
     * @param GameState $state
     * @return void
     */
//    public function setGameState(GameState $state): void {
//        $this->state = $state;
//    }

    /**
     * @return GameState
     */
    public function getGameState(): GameState {
        return $this->state;
    }

    /**
     * This method called when player socket closed
     * and we remove player with this connection from list
     * @param ConnectionInterface $conn
     * @param callable $onTerminate
     * @return void
     */
    public function onConnectionClose(ConnectionInterface $conn, callable $onTerminate): void
    {
        foreach ($this->players as $p) {
            if ($p->getConnection() === $conn) {
                $p->setOffline();
            }
        }

        // is all players offline we party should be terminated
        $onLinePlayers = array_filter($this->players, fn(Player $p) => $p->state == PlayerState::online);
        if (count($onLinePlayers)) $onTerminate();
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

}
