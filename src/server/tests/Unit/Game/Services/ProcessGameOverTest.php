<?php

namespace tests\Unit\Game\Services;

use App\Common\ResponseMessages\Message;
use Domain\Game\Contracts\Connection;
use Domain\Game\Contracts\Party;
use Domain\Game\Entities\Cup;
use Domain\Game\Entities\Player;
use Domain\Game\Enums\CupState;
use Domain\Game\Enums\GameState;
use Domain\Game\Services\ProcessGameOver;
use PHPUnit\Framework\TestCase;

/**
 *
 * @property Party fakeParty
 */
class ProcessGameOverTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->fakeParty = new class implements Party {
            /**
             * Player[]
             * @var array
             */
            private array $players = [];

            private GameState $gameState = GameState::ready;


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
                return $this->gameState;
            }

            #[\Override]
            public function setPause(): void
            {
                $this->gameState = GameState::paused;
            }

            #[\Override]
            public function setGameOver(): void
            {
                $this->gameState = GameState::over;
            }

            #[\Override]
            public function setGameRunning(): void
            {
                $this->gameState = GameState::running;
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

//
    public function test_that_party_in_necessary_state()
    {
        $this->fakeParty->setPause();
        $result = (new ProcessGameOver($this->fakeParty))();
        $this->assertTrue($result);

        $this->fakeParty->setGameOver();
        $result = (new ProcessGameOver($this->fakeParty))();
        $this->assertFalse($result);
    }

//
    public function test_that_party_have_active_players()
    {
        // set game running
        $this->fakeParty->setGameRunning();

        $mockCup = $this->createMock(Cup::class);
        $mockCup
            ->expects($this->once())
            ->method('getState')
            ->willReturn(CupState::online);

        $mockPlayer = $this->createMock(Player::class);
        $mockPlayer
            ->expects($this->once())
            ->method('getCup')
            ->willReturn($mockCup);

        $mockPlayer->expects($this->once())
            ->method('getId')
            ->willReturn('player_id');

        $this->fakeParty->addPlayer($mockPlayer);

        $mockCup = $this->createMock(Cup::class);
        $mockCup
            ->expects($this->once())
            ->method('getState')
            ->willReturn(CupState::online);

        $mockPlayer = $this->createMock(Player::class);
        $mockPlayer
            ->expects($this->once())
            ->method('getCup')
            ->willReturn($mockCup);

        $mockPlayer->expects($this->once())
            ->method('getId')
            ->willReturn('player_two_id');

        $this->fakeParty->addPlayer($mockPlayer);

        $result = (new ProcessGameOver($this->fakeParty))();
        $this->assertFalse($result);
    }

    public function test_that_all_players_ends()
    {
        // set game running
        $this->fakeParty->setGameRunning();


        $mockCup = $this->createMock(Cup::class);
        $mockCup
            ->expects($this->atLeastOnce())->method('getState')
            ->willReturn(CupState::over);

        $mockPlayer = $this->createMock(Player::class);
        $mockPlayer
            ->expects($this->atLeastOnce())
            ->method('getCup')
            ->willReturn($mockCup);

        $mockPlayer->expects($this->once())
            ->method('getId')
            ->willReturn('player_id');

        $this->fakeParty->addPlayer($mockPlayer);

        $mockCup2 = $this->createMock(Cup::class);
        $mockCup2
            ->expects($this->atLeastOnce())->method('getState')
            ->willReturn(CupState::over);

        $mockPlayerTwo = $this->createMock(Player::class);
        $mockPlayerTwo
            ->expects($this->atLeastOnce())
            ->method('getCup')
            ->willReturn($mockCup2);

        $mockPlayerTwo->expects($this->once())
            ->method('getId')
            ->willReturn('player_two_id');

        $this->fakeParty->addPlayer($mockPlayerTwo);

        // check result
        $result = (new ProcessGameOver($this->fakeParty))();
        $this->assertTrue($result);

        // check status
        $this->assertEquals(GameState::over, $this->fakeParty->getGameState());
    }

    public function test_that_selected_correct_winner()
    {
        // set game running
        $this->fakeParty->setGameRunning();


        $mockCup = $this->createMock(Cup::class);
        $mockCup->expects($this->exactly(2))
            ->method('getState')
            ->willReturn(CupState::online);

        $mockCup->expects($this->once())->method('setCupAsWinner');

        $mockPlayer = $this->createMock(Player::class);
        $mockPlayer->expects($this->exactly(3))
            ->method('getCup')
            ->willReturn($mockCup);

        $mockPlayer->expects($this->once())
            ->method('getId')
            ->willReturn('player_id');

        $this->fakeParty->addPlayer($mockPlayer);


        $mockCup2 = $this->createMock(Cup::class);
        $mockCup2
            ->expects($this->once())->method('getState')
            ->willReturn(CupState::over);

        $mockPlayerTwo = $this->createMock(Player::class);
        $mockPlayerTwo
            ->expects($this->atLeastOnce())
            ->method('getCup')
            ->willReturn($mockCup2);

        $mockPlayerTwo->expects($this->once())
            ->method('getId')
            ->willReturn('player_two_id');

        $this->fakeParty->addPlayer($mockPlayerTwo);

        // check result
        $result = (new ProcessGameOver($this->fakeParty))();
        $this->assertTrue($result);

        // check status
        $this->assertEquals(GameState::over, $this->fakeParty->getGameState());
    }
}