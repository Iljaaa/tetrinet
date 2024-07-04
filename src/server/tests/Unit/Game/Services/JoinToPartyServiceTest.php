<?php

namespace tests\Unit\Game\Services;


use App\Actions\Messages\JoinToParty;
use Domain\Game\Contracts\Connection;
use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Contracts\PoolOfPlayers;
use Domain\Game\Entities\Player;
use Domain\Game\Enums\PartyType;
use Domain\Game\Services\JoinToPartyService;
use PHPUnit\Framework\MockObject\Exception;
use Tests\TestCase;

class JoinToPartyServiceTest extends TestCase
{

    protected function setUp(): void
    {
        parent::setUp();

        $this->fakePlayersPool = new class implements PoolOfPlayers {
            private array $pool = [];

            public function onConnectionClose(Connection $c): void
            {
            }

            public function addPlayerToPull(PartyType $party, Player $player, callable $playersEnoughToMakeParty): void
            {
                $this->pool[$player->getConnection()->getSocketId()] = $player;

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
     * @throws Exception
     */
    public function test_join_player_to_pool()
    {
        $mocPartiesPool = $this->createMock(PoolOfParties::class);

        $mocPlayersPool = $this->createMock(PoolOfPlayers::class);
        $mocPlayersPool->expects($this->once())->method('addPlayerToPull');
        $mocPlayersPool->method('getPullSize')->willReturn(1);

        $m = new JoinToPartyService($mocPlayersPool, $mocPartiesPool);

        $vasilyMockConnection = $this->createMock(Connection::class);
        $vasilyMockConnection->expects($this->atLeastOnce())
            ->method('getSocketId')
            ->willReturn('socket_id');

        $m->handle($vasilyMockConnection, PartyType::duel, 'Vasily');

    }


    /**
     * @return void
     * @throws Exception
     */
    public function test_party_create()
    {
        $mocPartiesPool = $this->createMock(PoolOfParties::class);

        // this two methods must be called when count player in pool enough to create party
        $mocPartiesPool->expects($this->once())->method('createParty');
        $mocPartiesPool->expects($this->once())->method('addParty');

        $m = new JoinToPartyService($this->fakePlayersPool, $mocPartiesPool);

        // add first player

        $vasilyMocConnection = $this->createMock(Connection::class);
        $vasilyMocConnection->expects($this->atLeastOnce())
            ->method('getSocketId')
            ->willReturn('Vasiliy_socket_id');

        $m->handle($vasilyMocConnection, PartyType::duel, 'Petr');

        //
        $this->assertEquals(1, $this->fakePlayersPool->getPullSize(PartyType::duel));

        // add second player

        $mocConnection = $this->createMock(Connection::class);
        $mocConnection->expects($this->atLeastOnce())
            ->method('getSocketId')
            ->willReturn('petr_socket');

        $m->handle($mocConnection, PartyType::duel, 'Petr');
    }

}