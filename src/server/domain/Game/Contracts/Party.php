<?php

namespace Domain\Game\Contracts;


use App\Common\ResponseMessages\Message;
use Domain\Game\Entities\Player;
use Domain\Game\Enums\GameState;

/**
 * Main game unit
 * fixme: maybe this class violates the single responsibility principle
 */
interface Party
{
    /**
     * Create party with id
     * @param string $partyId
     */
    public function __construct(string $partyId);

    /**
     * Get party id
     * @return string
     */
    public function getId(): string;

    /**
     * Add a player to the party
     * @param Player $p
     * @return void
     */
    public function addPlayer(Player $p): void;

    /**
     * Get all payers form party
     * @return array
     */
    public function getPlayers(): array;

    /**
     * Get player by id
     * @param string $playerId
     * @return Player|null
     */
    public function getPlayerById(string $playerId): ?Player;

    /**
     * Current game state
     * @return GameState
     */
    public function getGameState(): GameState;

    /**
     * Set game to pause state
     * @return void
     */
    public function setPause(): void;

    /**
     * Set game over state
     * @return void
     */
    public function setGameOver(): void;

    /**
     * Set game over state
     * @return void
     */
    public function setGameRunning(): void;

    /**
     * @param Message $m
     * @return void
     * @deprecated this method must be moved from here to somewhere else
     * todo: move this method to stand alone service
     */
    public function sendMessageToAllPlayers(Message $m): void;


    /**
     * This method adds message to chat
     * todo: move this method to stane alone object chant when it be ready
     * @param string $message
     * @return void
     */
    public function addChatMessage(string $message): void;

    /**
     * @deprecated this method must be moved from here to somewhere else
     * todo: move this method to stand alone service
     */
    public function sendChatToAllPlayers(): void;
}