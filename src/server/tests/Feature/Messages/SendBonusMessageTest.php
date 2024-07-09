<?php

namespace tests\Feature\Messages;

use App\Actions\Messages\SendBonus;
use App\Common\ResponseMessages\Message;
use App\Common\Types\BonusType;
use Domain\Game\Contracts\Connection;
use Domain\Game\Contracts\Party;
use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Entities\Player;
use Domain\Game\Enums\GameState;
use Domain\Game\Enums\PartyType;
use PHPUnit\Framework\MockObject\Exception;
use Tests\TestCase;

/**
 * @property Party fakeParty
 */
class SendBonusMessageTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

//        $this->fakePlayersPool = new class implements PoolOfPlayers
//        {
//            private array $pool = [];
//            public function onConnectionClose(Connection $c): void {}
//
//            public function addPlayerToPull(PartyType $party, Player $player, callable $playersEnoughToMakeParty): void
//            {
//                $this->pool[$player->getConnection()->getSocketId()] = $player;
//                // dd($this->pool);
//
//                if (count($this->pool) == 2) {
//                    $playersEnoughToMakeParty($this->pool);
//                    $this->pool = [];
//                }
//            }
//
//            public function getPullSize(PartyType $party): int
//            {
//                return count($this->pool);
//            }
//        };

        $this->fakeParty = new class implements Party {
            /**
             * Player[]
             * @var array
             */
            private array $players = [];

            public function __construct(private string $partyId = "123")
            {
            }

            #[\Override]
            public function getId(): string
            {
                return $this->partyId;
            }

            #[\Override]
            public function addPlayer(Player $p): void
            {
                $this->players[$p->getId()] = $p;
            }

            #[\Override]
            public function getPlayers(): array
            {
                return $this->players;
            }

            #[\Override]
            public function getPlayerById(string $playerId): ?Player
            {
                return $this->players[$playerId] ?? null;
            }

            #[\Override]
            public function getGameState(): GameState
            {
                return GameState::over;
            }

            #[\Override]
            public function setPause(): void
            {
            }

            #[\Override]
            public function setGameOver(): void
            {
            }

            #[\Override]
            public function setGameRunning(): void
            {
            }

            #[\Override]
            public function sendMessageToAllPlayers(Message $m): void
            {
            }

            #[\Override]
            public function sendChatToAllPlayers(): void
            {
            }

            #[\Override]
            public function addChatMessage(string $message): void
            {
            }


            #[\Override]
            public function getCupsResponse(): array
            {
                return [];
            }

        };

    }

    // unknown bonus

    /**
     * @return void
     * @throws Exception
     */
    public function test_send_success()
    {
        $vladMockConnection = $this->createMock(Connection::class);
        $vladMockConnection->expects($this->atLeastOnce())
            ->method('getSocketId')
            ->willReturn('vlad_socket_id');

        $this->fakeParty->addPlayer(new Player($vladMockConnection, 'Vlad'));

        $vasilyMockConnection = $this->createMock(Connection::class);
        $vasilyMockConnection->expects($this->atLeastOnce())
            ->method('getSocketId')
            ->willReturn('vasili_socket_id');

        $this->fakeParty->addPlayer(new Player($vasilyMockConnection, 'Vasily'));

        // this method must be called when we send handshake to player
        // $vasilyMockConnection->expects($this->once())->method('send');

        $mocPartiesPool = $this->createMock(PoolOfParties::class);
        $mocPartiesPool->expects($this->once())
            ->method('getPartyById')
            ->willReturn($this->fakeParty);

        $m = new SendBonus($mocPartiesPool);

        $m([
            'partyId' => $this->fakeParty->getId(),
            'playerId' => 'vlad_socket_id',
            'target' => 'vasili_socket_id',
            'bonus' => BonusType::add->value
        ]);

    }

    /*
     * @return void
     * @throws Exception
     */
//    public function test_party_create()
//    {
//        $mocPartiesPool = $this->createMock(PoolOfParties::class);
//        $mocPartiesPool->expects($this->once())->method('createParty');
//        $mocPartiesPool->expects($this->once())->method('addParty');
//
//        $m = new JoinToParty($this->fakePlayersPool, $mocPartiesPool);
//
//        $vasilyMocConnection = $this->createMock(Connection::class);
//        $vasilyMocConnection->expects($this->atLeastOnce())
//            ->method('getSocketId')
//            ->willReturn('Vasiliy_socket_id');
//
//        // this method must be called when we send handshake to player
//        $vasilyMocConnection->expects($this->once())->method('send');
//
//        $m($vasilyMocConnection, [
//            'partyType' => PartyType::duel->value,
//            'playerName' => 'Petr'
//        ]);
//
//        //
//        $this->assertEquals(1, $this->fakePlayersPool->getPullSize(PartyType::duel));
//
//
//        $mocConnection = $this->createMock(Connection::class);
//        $mocConnection->expects($this->atLeastOnce())
//            ->method('getSocketId')
//            ->willReturn('petr_socket');
//        $mocConnection->expects($this->once())->method('send');
//
//        $m($mocConnection, [
//            'partyType' => PartyType::duel->value,
//            'playerName' => 'Petr'
//        ]);
//
//    }
}