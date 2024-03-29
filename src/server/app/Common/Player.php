<?php

namespace App\Common;

use App\Common\Types\PlayerState;
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
     * Player name
     * @var string
     */
    private string $name;

    /**
     * @var Cup
     */
    private Cup $cup;

    /**
     * Player state
     * @var PlayerState
     */
    public PlayerState $state;

    /**
     * Pauses limit
     */
    private int $pauses = 5;

    public function __construct(ConnectionInterface $connection, string $name)
    {
        $this->connetion = $connection;
        $this->name = $name;
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

    /**
     * Get socket is from connection
     * @return string
     */
    public function getConnectionId(): string
    {
        return $this->connetion->socketId;
    }

    /**
     * @return Cup
     */
    public function getCup(): Cup
    {
        return $this->cup;
    }

    /**
     * @param Cup $cup
     * @return Player
     */
    public function setCup(Cup $cup): static
    {
        $this->cup = $cup;
        return $this;
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
     * Is player inline
     * @return bool
     */
    public function isOnLine (): bool
    {
        return $this->state == PlayerState::online;
    }

    /**
     * Is player inline
     * @return bool
     */
    public function isOffLine (): bool
    {
        return $this->state == PlayerState::offline;
    }

    /**
     * Set status offline
     * @return void
     */
    public function setOffline(): void
    {
        $this->state = PlayerState::offline;
    }

    /**
     * @return string
     */
    public function getName ():string
    {
        return $this->name;
    }

    public function getPauses(): int
    {
        return $this->pauses;
    }

    public function decreasePause (): void
    {
        $this->pauses--;
    }

}
