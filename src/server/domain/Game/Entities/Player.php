<?php

namespace Domain\Game\Entities;

use Domain\Game\Contracts\Connection;
use Domain\Game\Enums\PlayerState;

/**
 * Player object it is,
 * todo: refactor player to aggregate with connection and player
 * todo: make factory method
 */
class Player
{
    const START_PAUSES_COUNT = 5;

    /**
     * Uniq player id
     * equals to socketId
     * @var string
     */
    private string $id;

    /**
     * @var Connection
     */
    private Connection $connection;

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
    private PlayerState $state;

    /**
     * Pauses limit
     */
    private int $pauses;

    public function __construct(Connection $connection, string $name)
    {
        $this->connection = $connection;
        $this->id = $connection->getSocketId();

        $this->name = $name;
        $this->state = PlayerState::online;
        $this->cup = new Cup();

        $this->pauses = self::START_PAUSES_COUNT;
    }

    /**
     * @param Connection $connection
     * @param string $name
     * @return Player
     */
    public static function create(Connection $connection, string $name): Player
    {
        return new self($connection, $name);
    }

    /**
     * @return Connection
     */
    public function getConnection(): Connection
    {
        return $this->connection;
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
     * @deprecated use getCup()->updateByData()
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

    /**
     * @return string
     */
    public function getId(): string
    {
        return $this->id;
    }

    public function getPauses(): int
    {
        return $this->pauses;
    }

    public function decreasePause (): void
    {
        if ($this->pauses > 0) {
            $this->pauses--;
        }
    }

}
