<?php

namespace App\Common;

// use Random\RandomException;
use Ratchet\ConnectionInterface;

class Party
{
    /**
     * @var string
     */
    public string $partId = '';

    /**
     * @var ConnectionInterface[]
     */
    private array $players = [];

    /**
     * @param ConnectionInterface $hostConnection
     * @throws RandomException
     */
    public function __construct (ConnectionInterface $hostConnection)
    {
        // generate party id
        $this->partId = sprintf('%d.%d', random_int(1, 1000000000), random_int(1, 1000000000));

        // add host tp party
        $this->players[] = $hostConnection;
    }

    /**
     * Add player into party and return his index in in
     * @param ConnectionInterface $connection
     * @return int
     */
    public function addPlayer (ConnectionInterface $connection): int
    {
        $this->players[] = $connection;
        return array_search($connection, $this->players);
    }

    /**
     * If party full of palyers
     * @return bool
     */
    public function isPartFull ():bool
    {
        return (count($this->players) == 2);
    }

    /**
     * @return ConnectionInterface[]
     */
    public function getPlayers (): array
    {
        return $this->players;
    }

}
