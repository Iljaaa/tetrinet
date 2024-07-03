<?php

namespace tests\Unit\Game;

use Domain\Game\Contracts\Connection;
use Domain\Game\Entities\Player;
use PHPUnit\Framework\TestCase;

/**
 * @property Player $player
 */
class PlayerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $mockConnection = $this->createMock(Connection::class);
        $mockConnection
            ->expects($this->once())
            ->method('getSocketId')
            ->willReturn('test_socket_and_player_id');

        $this->player = Player::create($mockConnection, 'Vlad Cepich III');
    }


    public function test_player_create()
    {
        $this->assertEquals('test_socket_and_player_id', $this->player->getId());
        $this->assertEquals('Vlad Cepich III', $this->player->getName());
        $this->assertEquals(Player::START_PAUSES_COUNT, $this->player->getPauses());
        $this->assertTrue($this->player->isOnLine());
        $this->assertNotEmpty($this->player->getCup());
    }

    public function test_player_set_offline_status()
    {
        $this->assertTrue($this->player->isOnLine());
        $this->assertFalse($this->player->isOffLine());

        $this->player->setOffLine();

        $this->assertFalse($this->player->isOnLine());
        $this->assertTrue($this->player->isOffLine());
    }

    public function test_player_decrease_pauses()
    {
        $this->assertEquals(Player::START_PAUSES_COUNT, $this->player->getPauses());

        while ($this->player->getPauses() > 0) {
            $this->player->decreasePause();
        }

        $this->assertEquals(0, $this->player->getPauses());

        $this->player->decreasePause();
        $this->assertEquals(0, $this->player->getPauses());
    }
    // decrease pauses
}