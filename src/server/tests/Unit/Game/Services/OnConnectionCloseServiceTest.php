<?php

namespace tests\Unit\Game\Services;

use Domain\Game\Aggregates\PartyImp;
use Domain\Game\Contracts\Connection;
use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Contracts\PoolOfPlayers;
use Domain\Game\Entities\Player;
use Domain\Game\Enums\GameState;
use Domain\Game\Services\ConnectionClose;
use PHPUnit\Framework\TestCase;

/**
 * todo: add test determineGameOverInSetItOver
 * todo: add test terminatePartyByPartyId
 *
 * @property Connection $connection
 * @property PoolOfPlayers $playersPool
 * @property PoolOfParties $partiesPool
 */
class OnConnectionCloseServiceTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->connection = $this->createMock(Connection::class);
        $this->connection->expects($this->atLeastOnce()) // todo: make one call
        ->method('getSocketId')
            ->willReturn('test_socket_id');

        $this->playersPool = $this->createMock(PoolOfPlayers::class);
        $this->playersPool->expects($this->once())->method('onConnectionClose');

        $this->partiesPool = $this->createMock(PoolOfParties::class);
    }


    /**
     *
     */
    public function test_player_not_found_in_pools(): void
    {
        $s = new ConnectionClose($this->playersPool, $this->partiesPool);
        $s($this->connection);
    }

    /**
     * todo: add cup methods call check
     */
    public function test_found_in_parties_pool(): void
    {
        $player = $this->createMock(Player::class);
        $player
            ->expects($this->once())
            ->method('isOffLine')
            ->willReturn(false);

        $player
            ->expects($this->once())
            ->method('setOffline');

        $party = $this->createMock(PartyImp::class);
        $party
            ->method('getPlayerById')
            ->willReturn($player);

        $party->method('getGameState')
            ->willReturn(GameState::paused);

        $this->partiesPool
            ->method('findPartyByPlayerId')
            ->willReturn($party);


        $s = new ConnectionClose($this->playersPool, $this->partiesPool);
        $s($this->connection);
    }
}