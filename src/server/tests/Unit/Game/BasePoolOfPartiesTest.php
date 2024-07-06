<?php

namespace tests\Unit\Game;

use Domain\Game\Aggregates\BasePoolOfParties;

use Domain\Game\Contracts\Party;
use Domain\Game\Entities\Player;
use PHPUnit\Framework\TestCase;

/**
 *
 * @property BasePoolOfParties $pool
 */
class BasePoolOfPartiesTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->pool = new BasePoolOfParties();
    }


    public function test_create_party()
    {
        $party = $this->pool->createParty(fn() => "test_party");

        $this->assertInstanceOf(Party::class, $party);
        $this->assertNotEmpty($party->getId());
    }

    public function test_add_party_and_then_get()
    {
        $party = $this->pool->createParty(fn() => "test_party");
        $this->pool->addParty($party);
        $this->assertNotEmpty($this->pool->getPartyById($party->getId()));
    }

    public function test_add_party_with_player_and_then_get_by_player()
    {
        $playerMock = $this->createMock(Player::class);
        $playerMock
            ->expects($this->once())
            ->method('getId')
            ->willReturn('test_player_id');

        $party = $this->pool->createParty(fn() => "test_party");
        $party->addPlayer($playerMock);

        $this->pool->addParty($party);

        $this->assertNotEmpty($this->pool->findPartyByPlayerId('test_player_id'));
    }

    public function test_terminate_party()
    {
        $party = $this->pool->createParty(fn() => "test_party");
        $this->pool->addParty($party);
        $this->pool->terminatePartyByPartyId($party->getId());

        $this->assertEmpty($this->pool->getPartyById($party->getId()));
    }
}