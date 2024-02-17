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
     * @var Player[]
     */
    private array $players = [];

    /*
     * Player cups
     * @var Cup[]
     */
    // public array $cups = [];

    /**
     * @throws RandomException
     */
    public function __construct () {
        // generate party id
        $this->partyId = sprintf('%d.%d', random_int(1, 1000000000), random_int(1, 1000000000));
    }

    /**
     * Add player into party and return his index in in
     * @param ConnectionInterface $connection
     *
     * @return int player index in the party
     */
    public function addPlayer (ConnectionInterface $connection): int
    {
        $this->players[] = new Player($connection);
        return array_search($connection, $this->players);
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
     * todo: refactor to socketId
     * @param int $partyIndex
     * @param array $cup cup info from request
     * @return void
     */
    public function setCupByPartyIndex(int $partyIndex, array $cup): void
    {
        // update cup data
        $this->players[$partyIndex]->updateCup($cup);
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
    public function pause ():void {
        $this->state = GameState::paused;
    }

    /**
     * @param GameState $state
     * @return void
     */
    public function setGameState(GameState $state): void {
        $this->state = $state;
    }

    /**
     * @return GameState
     */
    public function getGameState(): GameState {
        return $this->state;
    }

    /**
     * This method called when closed
     * and we remove player with this connection from list
     * @param ConnectionInterface $conn
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

}
