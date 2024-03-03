<?php

namespace App\Common\Types;

/**
 * This is global game state
 * we do not received it from client
 */
enum GameState : string
{
    case ready = 'ready';
    case running = 'running';
    case paused = 'paused';

    case over = 'over'; // when all cups are over
}
