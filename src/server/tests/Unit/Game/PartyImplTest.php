<?php

namespace tests\Unit\Game;

use Domain\Game\Aggregates\PartyImp;
use Domain\Game\Entities\Player;
use Domain\Game\Enums\GameState;
use PHPUnit\Framework\TestCase;

/**
 * @property PartyImp $party
 */
class PartyImplTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->party = new PartyImp('test_party');
    }


    public function test_create_with_default_params()
    {
        $this->assertEquals('test_party', $this->party->getId());
        $this->assertEquals(GameState::ready, $this->party->getGameState());
        $this->assertCount(0, $this->party->getPlayers());
    }

    public function test_set_pause()
    {
        $this->assertEquals(GameState::ready, $this->party->getGameState());

        $this->party->setPause();
        $this->assertEquals(GameState::paused, $this->party->getGameState());

        $this->party->setGameRunning();
        $this->assertEquals(GameState::running, $this->party->getGameState());
    }

    public function test_set_game_over()
    {
        $this->party->setGameOver();
        $this->assertEquals(GameState::over, $this->party->getGameState());
    }


    public function test_party_add_player()
    {
        $mockPlayer = $this->createMock(Player::class);

        $this->party->addPlayer($mockPlayer);

        $this->assertCount(1, $this->party->getPlayers());
    }



//    public function test_player_leave()
//    {
//        $mocConnection = $this->createMock(Connection::class);
//
//        $player = new Player($mocConnection, 'Vlad');
//
//        $party = new Party();
//        $party->addPlayer($player);
//
//        $mockPartiesPool = $this->createMock(PoolOfParties::class);
//        $mockPartiesPool->method('getPartyById')->willReturn($mockParty);
//
//        $party = (new LeavePartyService($mockPartiesPool))('123', '123');
//
//        $this->assertEquals(PlayerState::offline, $player->state);
//        $this->assertEquals(CupState::over, $player->getCup()->getState());
//    }


    // test that user exists in party and not
}