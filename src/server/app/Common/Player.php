<?php

namespace App\Common;

use Ratchet\ConnectionInterface;

/**
 * Player object it is,
 */
class Player
{
    /**
     * @var ConnectionInterface
     */
    private ConnectionInterface $connetion;

    /**
     * @var Cup
     */
    private Cup $cup;

    /**
     * Player state
     * @var PlayerState
     */
    public PlayerState $state;

    public function __construct(ConnectionInterface $connection)
    {
        $this->connetion = $connection;
        $this->state = PlayerState::online;
        $this->cup = new Cup();
    }

    /**
     * @return ConnectionInterface
     */
    public function getConnection(): ConnectionInterface
    {
        return $this->connetion;
    }

    public function getCup(): Cup
    {
        return $this->cup;
    }

    /**
     * @param array $data
     * @return void
     */
    public function updateCup (array $data): void
    {
        $this->cup->updateByData($data);
    }

    /**
     * Set status offline
     * @return void
     */
    public function setOffline(): void
    {
        $this->state = PlayerState::offline;
    }
}
