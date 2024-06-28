<?php

namespace App\Services\Game;

use App\Common\Player;
use App\Contracts\Game\PoolOfPlayers;
use Illuminate\Support\Facades\Log;
use Ratchet\ConnectionInterface;

/**
 * Base pool
 */
class BasePoolOfPlayers implements PoolOfPlayers
{

    const DEAD_MATCH_PARTY_SIZE = 5;

    /**
     * Pull for duels
     * @var Player[]
     */
    private array $duels = [];

    /**
     * Pool for parties
     * @var Player[]
     */
    private array $party = [];

    /**
     * @param Player $player
     * @param callable $onPartyFullCallback
     * @return void
     */
    public function addToDuels(Player $player, callable $onPartyFullCallback): void
    {
        $this->duels[] = $player;
        Log::channel('socket')->info('connection added to pool', [
            'pool' => 'duel',
            'socketId' => $player->getConnectionId(),
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
            $onPartyFullCallback($party);
        }
    }


    /**
     * @param Player $player
     * @param callable $onPartyFullCallback
     * @return void
     */
    public function addToParty(Player $player, callable $onPartyFullCallback): void
    {
        $this->party[] = $player;
        Log::channel('socket')->info('connection added to pool', [
            'pool' => 'party',
            'socketId' => $player->getConnectionId(),
            'size' => count($this->party)
        ]);

        $partySize = static::DEAD_MATCH_PARTY_SIZE;
        $party = [];

        if (count($this->party) >= $partySize)
        {
            Log::channel('socket')->info('pool if full, we ready to create a game', ['size' => count($this->party)]);

            // take two
            while (count($party) < $partySize) {
                $party[] = array_shift($this->party);
            }

            //
            $onPartyFullCallback($party);
        }
    }

    /**
     * When connection close we search it in pools
     * @param ConnectionInterface $conn
     * @return void
     */
    public function onConnectionClose(ConnectionInterface $conn): void
    {
        Log::channel('socket')->info(__METHOD__, ['playerId' => $conn->socketId]);

        // looking for connection in players pool
        // $index = array_search($conn, $this->duels);
        // if ($index > -1) {
            // Log::channel('socket')->info('connection found in duel pull', ['index' => $index, 'size' => count($this->duelPlayersPool)]);
            // filter from pool out connection
        $this->duels = array_filter($this->duels, fn (Player $p) =>  $p->getConnectionId() != $conn->socketId);
        // }

        // looking for connection in players pool
        // $index = array_search($conn, $this->party);
        // if ($index > -1) {
            // Log::channel('socket')->info('connection found in party pull', ['index' => $index, 'size' => count($this->duelPlayersPool)]);
            // filter from pool out connection
        $this->party = array_filter($this->party, fn (Player $p) =>  $p->getConnectionId() != $conn->socketId);
        //}

        Log::channel('socket')->info('size', ['duel' => count($this->duels), 'party' => count($this->party)]);
    }
}
