<?php

namespace tests\Unit;

use Domain\Game\Aggregates\BasePoolOfPlayers;
use Domain\Game\Entities\Player;
use Domain\Game\Enums\PartyType;
use Domain\Game\ValueObjects\Connection;
use PHPUnit\Framework\MockObject\Exception;
use PHPUnit\Framework\TestCase;

class PoolOfPlayersTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->mockConnection = $this->createMock(Connection::class);
        $this->mockConnection->method('getSocketId')
            ->willReturn('mockSocketId');
    }


    /**
     * @throws Exception
     */
    public function test_add_player_into_pool()
    {
        $player = new Player($this->mockConnection, 'Vasinka');

        $pool = new BasePoolOfPlayers();
        $pool->addPlayerToPull(PartyType::duel, $player, fn () => null);

        $this->assertEquals(1, $pool->getPullSize(PartyType::duel));
    }

    /**
     * Duel need only two players
     * @return void
     * @throws \PHPUnit\Framework\MockObject\Exception
     */
    public function test_enough_players_to_start_duel()
    {
        // callback mock
        $callbackMock = $this->getMockBuilder(\stdClass::class)
            ->addMethods(['__invoke'])
            ->getMock();
        $callbackMock->expects($this->once())
            ->method('__invoke');


        // $mocConnection->expects($this->exactly(2))

        $pool = new BasePoolOfPlayers();
        $pool->addPlayerToPull(PartyType::duel, new Player($this->mockConnection, 'Vasinka'), $callbackMock);
        $pool->addPlayerToPull(PartyType::duel, new Player($this->mockConnection, 'Petya'), $callbackMock);


        $this->assertEquals(0, $pool->getPullSize(PartyType::duel));

    }

    public function test_enough_players_to_start_dead_math()
    {
        // callback mock
        $callbackMock = $this->getMockBuilder(\stdClass::class)
            ->addMethods(['__invoke'])
            ->getMock();
        $callbackMock->expects($this->once())
            ->method('__invoke');


        $pool = new BasePoolOfPlayers();
        $pool->addPlayerToPull(PartyType::party, new Player($this->mockConnection, 'Vasinka'), $callbackMock);
        $pool->addPlayerToPull(PartyType::party, new Player($this->mockConnection, 'Petya'), $callbackMock);
        $pool->addPlayerToPull(PartyType::party, new Player($this->mockConnection, 'Petya'), $callbackMock);
        $pool->addPlayerToPull(PartyType::party, new Player($this->mockConnection, 'Petya'), $callbackMock);
        $pool->addPlayerToPull(PartyType::party, new Player($this->mockConnection, 'Petya'), $callbackMock);


        $this->assertEquals(0, $pool->getPullSize(PartyType::party));
    }


    public function test_when_connection_close()
    {
        $pool = new BasePoolOfPlayers();

        $pool->addPlayerToPull(PartyType::party, new Player($this->mockConnection, 'Vasinka'), fn() => null);
        $this->assertEquals(1, $pool->getPullSize(PartyType::party));

        // close connection
        $pool->onConnectionClose($this->mockConnection);

        $this->assertEquals(0, $pool->getPullSize(PartyType::party));
    }
}