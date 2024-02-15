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
    public $cup;

    public function __construct(ConnectionInterface $connection)
    {
        $this->connetion = $connection;
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
}
