<?php

namespace tests\Unit;

use App\Actions\OnConnectionClose;
use App\Contracts\Game\PoolOfParties;
use App\Contracts\Game\PoolOfPlayers;
use Domain\Game\ValueObjects\Connection;
use PHPUnit\Framework\TestCase;
use Ratchet\ConnectionInterface;

class OnConnectionCloseTest extends TestCase
{
    /**
     *
     */
    public function test_close_connection_when_party_not_found(): void
    {
        //
        // $ratchetConnection = $this->createMock(ConnectionInterface::class);

        $mocConnection = $this->createMock(Connection::class);
        $mocConnection->expects($this->once())->method('getSocketId');

        $mocPartiesPool = $this->createMock(PoolOfParties::class);
        $mocPartiesPool->expects($this->once())->method('findPartyByPlayerId')->willReturn(null);

        $mocPlayersPool = $this->createMock(PoolOfPlayers::class);


        (new OnConnectionClose($mocConnection, $mocPlayersPool, $mocPartiesPool))
            ->handle();

        $this->assertTrue(true);
    }
}
