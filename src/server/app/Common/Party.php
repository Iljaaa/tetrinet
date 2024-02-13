<?php

namespace App\Common;

// use Random\RandomException;
use Ratchet\ConnectionInterface;

class Party
{
    /**
     * Party is generated when game starts
     * @var string
     */
    public string $partyId = '';

    /**
     * Player connections
     * @var ConnectionInterface[]
     */
    private array $players = [];

    /**
     * Player cups
     * @var Cup[]
     */
    public array $cups = [];

    /**
     * @param ConnectionInterface $hostConnection
     * @throws RandomException
     */
    public function __construct (ConnectionInterface $hostConnection)
    {
        // generate party id
        $this->partyId = sprintf('%d.%d', random_int(1, 1000000000), random_int(1, 1000000000));

        // add host tp party
        $this->players[] = $hostConnection;

        // create cup for host
        $this->cups[] = new Cup();
    }

    /**
     * Add player into party and return his index in in
     * @param ConnectionInterface $connection
     *
     * @return int player index in the party
     */
    public function addPlayer (ConnectionInterface $connection): int
    {
        $this->players[] = $connection;

        $playerIndexInTheParty = array_search($connection, $this->players);

        // create cup for player
        $this->cups[$playerIndexInTheParty] = new Cup();

        return $playerIndexInTheParty;
    }


    /**
     * @param int $partyIndex
     * @param array $cup cup info from request
     * @return void
     */
    public function setCupByPartyIndex(int $partyIndex, array $cup)
    {
        // update cup data
        $this->cups[$partyIndex]->updateByData($cup);
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
