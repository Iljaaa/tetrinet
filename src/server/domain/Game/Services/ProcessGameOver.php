<?php

namespace Domain\Game\Services;

use App\Common\ResponseMessages\GameOverMessage;
use Domain\Game\Contracts\Party;
use Domain\Game\Entities\Player;
use Domain\Game\Enums\CupState;
use Domain\Game\Enums\GameState;

/**
 * This process determines that the game has ended
 * after the occurrence of any events
 */
class ProcessGameOver
{
    public function __construct(private Party $party)
    {

    }

    public function __invoke(): bool
    {
        // check that game is over
        if (!$this->isGameIsOver()) return false;

        // set game over status
        $this->party->setGameOver();

        // searching winner
        $winner = $this->getWinner();

        // change winner state
        if ($winner) {
            $winner->getCup()->setCupAsWinner();
        }

        if ($winner) {
            // this must be in callback
            $this->party->addChatMessage(sprintf('End of the game, winner: __%s__', $winner->getName()));
            $this->party->sendChatToAllPlayers();
        }

        // inform all players
        $this->party->sendMessageToAllPlayers(new GameOverMessage($this->party));

        return true;
    }

    /**
     * Game is over when all player are over game or leave
     * @return bool
     */
    private function isGameIsOver(): bool
    {
        //
        if (!in_array($this->party->getGameState(), [GameState::running, GameState::paused])) {
            return false;
        }

        // check players with active cups
        $activeCups = array_filter($this->party->getPlayers(), fn(Player $p) => $p->getCup()->getState() == CupState::online);
        if (count($activeCups) > 1) return false;

        return true;
    }

    /**
     * Get winner
     * @return Player|null
     */
    private function getWinner(): ?Player
    {
        foreach ($this->party->getPlayers() as $p) {
            if ($p->getCup()->getState() == CupState::online) {
                return $p;
            }
        }

        return null;
    }
}