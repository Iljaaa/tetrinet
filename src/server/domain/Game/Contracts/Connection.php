<?php

namespace Domain\Game\Contracts;

/**
 * Connection that player used
 */
interface Connection
{
    /**
     * Socket id that given to connection on create
     * @return string
     */
    public function getSocketId(): string;

    /**
     * Send data to connection
     * @param string $data
     * @return void
     */
    public function send(string $data): void;
}