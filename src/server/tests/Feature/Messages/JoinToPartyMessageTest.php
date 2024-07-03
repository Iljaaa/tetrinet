<?php

namespace tests\Feature\Messages;

use App\Actions\Messages\JoinToParty;
use Domain\Game\Contracts\Connection;
use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Contracts\PoolOfPlayers;
use Domain\Game\Entities\Player;
use Domain\Game\Enums\PartyType;
use Tests\TestCase;

class JoinToPartyMessageTest extends TestCase
{
    protected function setUp():void
    {
        parent::setUp();

        $this->fakePlayersPool = new class implements PoolOfPlayers
        {
            private array $pool = [];
            public function onConnectionClose(Connection $c): void {}

            public function addPlayerToPull(PartyType $party, Player $player, callable $playersEnoughToMakeParty): void
            {
                $this->pool[$player->getConnection()->getSocketId()] = $player;
                // dd($this->pool);

                if (count($this->pool) == 2) {
                    $playersEnoughToMakeParty($this->pool);
                    $this->pool = [];
                }
            }

            public function getPullSize(PartyType $party): int
            {
                return count($this->pool);
            }
        };
    }

    /**
     * @return void
     * @throws \PHPUnit\Framework\MockObject\Exception
     */
    public function test_join_player_to_pool()
    {
        $mocPartiesPool = $this->createMock(PoolOfParties::class);

        $mocPlayersPool = $this->createMock(PoolOfPlayers::class);
        $mocPlayersPool->expects($this->once())->method('addPlayerToPull');
        $mocPlayersPool->method('getPullSize')->willReturn(1);


        $m = new JoinToParty($mocPlayersPool, $mocPartiesPool);

        $vasilyMockConnection = $this->createMock(Connection::class);
        $vasilyMockConnection->expects($this->atLeastOnce())
            ->method('getSocketId')
            ->willReturn('socket_id');
        $vasilyMockConnection->expects($this->once())->method('send');

        $m($vasilyMockConnection, [
            'partyType' => PartyType::duel->value,
            'playerName' => 'Vasily'
        ]);

        //
        // $this->assertEquals(1, $mocPlayersPool->getPullSize(PartyType::duel));
    }

    /**
     * @return void
     * @throws \PHPUnit\Framework\MockObject\Exception
     */
    public function test_party_create()
    {
        $mocPartiesPool = $this->createMock(PoolOfParties::class);
        $mocPartiesPool->expects($this->once())->method('createParty');
        $mocPartiesPool->expects($this->once())->method('addParty');
        $m = new JoinToParty($this->fakePlayersPool, $mocPartiesPool);


        $vasilyMocConnection = $this->createMock(Connection::class);
        $vasilyMocConnection->expects($this->atLeastOnce())
            ->method('getSocketId')
            ->willReturn('Vasiliy_socket_id');
        $vasilyMocConnection->expects($this->once())->method('send');

        $m($vasilyMocConnection, [
            'partyType' => PartyType::duel->value,
            'playerName' => 'Petr'
        ]);

        //
        $this->assertEquals(1, $this->fakePlayersPool->getPullSize(PartyType::duel));


        $mocConnection = $this->createMock(Connection::class);
        $mocConnection->expects($this->atLeastOnce())
            ->method('getSocketId')
            ->willReturn('petr_socket');
        $mocConnection->expects($this->once())->method('send');

        $m($mocConnection, [
            'partyType' => PartyType::duel->value,
            'playerName' => 'Petr'
        ]);

//        $m($mocConnection, [
//            'partyType' => PartyType::duel->value,
//            'playerName' => 'Petr'
//        ]);

    }

    // party creates
}