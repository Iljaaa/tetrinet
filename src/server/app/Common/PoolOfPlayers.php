<?php

namespace App\Common;

use Illuminate\Support\Facades\Log;
use Ratchet\ConnectionInterface;

/**
 * Pull of players who are looking for a game
 */
class PoolOfPlayers
{
    /**
     * Pull for duels
     * @var ConnectionInterface[]
     */
    private array $duels = [];

    /**
     * Pool for parties
     * @var ConnectionInterface[]
     */
    private array $party = [];

    /**
     * @param ConnectionInterface $conn
     * @param callable $onPartyFull
     * @return void
     */
    public function addToDuels(ConnectionInterface $conn, callable $onPartyFull): void
    {
        $this->duels[] = $conn;
        Log::channel('socket')->info('connection added to pool', [
            'pool' => 'duel',
            'socketId' => $conn->socketId,
            'size' => count($this->duels)
        ]);

        $partySize = 2;
        $party = [];

        if (count($this->duels) >= $partySize)
        {
            // take two
            while (count($party) < $partySize) {
                $party[] = array_shift($this->duels);
            }

            //
            $onPartyFull($party);
        }
    }


    /**
     * @param ConnectionInterface $conn
     * @param callable $onPartyFull
     * @return void
     */
    public function addToParty(ConnectionInterface $conn, callable $onPartyFull): void
    {
        $this->party[] = $conn;
        Log::channel('socket')->info('connection added to pool', [
            'pool' => 'party',
            'socketId' => $conn->socketId,
            'size' => count($this->party)
        ]);

        $partySize = 5;
        $party = [];

        if (count($this->party) >= $partySize)
        {
            Log::channel('socket')->info('pool if full, we ready to create a game', ['size' => count($this->party)]);

            // take two
            while (count($party) < $partySize) {
                $party[] = array_shift($this->party);
            }

            //
            $onPartyFull($party);
        }
    }

    /**
     * When connection close we search it in pools
     * @param ConnectionInterface $conn
     * @return void
     */
    public function onConnectionClose(ConnectionInterface $conn)
    {
        Log::channel('socket')->info(__METHOD__, ['playerId' => $conn->socketId]);

        // looking for connection in players pool
        // $index = array_search($conn, $this->duels);
        // if ($index > -1) {
            // Log::channel('socket')->info('connection found in duel pull', ['index' => $index, 'size' => count($this->duelPlayersPool)]);
            // filter from pool out connection
        $this->duels = array_filter($this->duels, fn (ConnectionInterface $c) =>  $c->socketId != $conn->socketId);
        // }

        // looking for connection in players pool
        // $index = array_search($conn, $this->party);
        // if ($index > -1) {
            // Log::channel('socket')->info('connection found in party pull', ['index' => $index, 'size' => count($this->duelPlayersPool)]);
            // filter from pool out connection
        $this->party = array_filter($this->party, fn (ConnectionInterface $c) =>  $c->socketId != $conn->socketId);
        //}

        Log::channel('socket')->info('size', ['duel' => count($this->duels), 'party' => count($this->party)]);
    }
}
