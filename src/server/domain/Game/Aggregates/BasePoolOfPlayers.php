<?php

namespace Domain\Game\Aggregates;


use Domain\Game\Contracts\Connection;
use Domain\Game\Contracts\PoolOfPlayers;
use Domain\Game\Entities\Player;
use Domain\Game\Enums\PartyType;

/**
 * Base pool of players
 */
class BasePoolOfPlayers implements PoolOfPlayers
{
    const DUEL_PARTY_SIZE = 2;
    const DEADMATH_PARTY_SIZE = 5;

    /**
     * Pools of players
     */
    private array $pools = [];

    /**
     * @inheritDoc
     */
    public function addPlayerToPull(PartyType $party, Player $player, callable $playersEnoughToMakeParty): void
    {
        if (!isset($this->pools[$party->value])) {
            $this->pools[$party->value] = [];
        }

        $this->pools[$party->value][] = $player;

        // if players count enough to start party
        // fixme: this is bad code, may be you should refactor to pool objects
        if ($party == PartyType::party && count($this->pools[$party->value]) == static::DEADMATH_PARTY_SIZE) {
            $this->processFullParty($party, static::DEADMATH_PARTY_SIZE, $playersEnoughToMakeParty);
        } // fixme: this is bad code, may be you should refactor to pool objects
        elseif ($party == PartyType::duel && count($this->pools[$party->value]) == static::DUEL_PARTY_SIZE) {
            $this->processFullParty($party, static::DUEL_PARTY_SIZE, $playersEnoughToMakeParty);
        }

    }

    /**
     * Create play part
     * fixme: this method not good because it receive size is should take it from pool
     * @param PartyType $partyType
     * @param int $partySize
     * @param callable $playersEnoughToMakeParty
     * @return void
     */
    private function processFullParty (PartyType $partyType, int $partySize, callable $playersEnoughToMakeParty): void
    {
        $party = [];

        // take two
        while (count($party) < $partySize) {
            $party[] = array_shift($this->pools[$partyType->value]);
        }

        //
        $playersEnoughToMakeParty($party);
    }

    /*
     * @param Player $player
     * @param callable $onPartyFullCallback
     * @return void
     */
//    public function addToDuels(Player $player, callable $onPartyFullCallback): void
//    {
//        $this->duels[] = $player;
//        Log::channel('socket')->info('connection added to pool', [
//            'pool' => 'duel',
//            'socketId' => $player->getConnectionId(),
//            'size' => count($this->duels)
//        ]);
//
//        $partySize = 2;
//        $party = [];
//
//        if (count($this->duels) >= $partySize)
//        {
//            // take two
//            while (count($party) < $partySize) {
//                $party[] = array_shift($this->duels);
//            }
//
//            //
//            $onPartyFullCallback($party);
//        }
//    }


    /*
     * @param Player $player
     * @param callable $onPartyFullCallback
     * @return void
     */
//    public function addToParty(Player $player, callable $onPartyFullCallback): void
//    {
//        $this->party[] = $player;
//        Log::channel('socket')->info('connection added to pool', [
//            'pool' => 'party',
//            'socketId' => $player->getConnectionId(),
//            'size' => count($this->party)
//        ]);
//
//        $partySize = static::DEAD_MATCH_PARTY_SIZE;
//        $party = [];
//
//        if (count($this->party) >= $partySize)
//        {
//            Log::channel('socket')->info('pool if full, we ready to create a game', ['size' => count($this->party)]);
//
//            // take two
//            while (count($party) < $partySize) {
//                $party[] = array_shift($this->party);
//            }
//
//            //
//            $onPartyFullCallback($party);
//        }
//    }

    /**
     * When connection close we search it in pools
     * @param Connection $c
     * @return void
     */
    public function onConnectionClose(Connection $c): void
    {
        foreach ($this->pools as $poolKey => $pool) {
            // $this->pools[$poolKey] = array_filter($this->pools[$poolKey], fn (Player $p) =>  $p->getConnection()->getSocketId() != $c->getSocketId());
            $this->pools[$poolKey] = array_filter($this->pools[$poolKey], fn(Player $p) => $p->getId() != $c->getSocketId());
        }

        // looking for connection in players pool
        // $this->duels = array_filter($this->duels, fn (Player $p) =>  $p->getConnectionId() != $c->getSocketId());

        // looking for connection in players pool
        // $this->party = array_filter($this->party, fn (Player $p) =>  $p->getConnectionId() != $c->getSocketId());
    }

    /**
     * @inheritDoc
     * @param PartyType $party
     * @return int
     */
    public function getPullSize(PartyType $party): int
    {
        return ($this->pools[$party->value])
            ? count($this->pools[$party->value])
            : 0;
    }
}
