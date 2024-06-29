<?php


/**
 * @return string
 * @throws \Random\RandomException
 */
function generateRandomPlayerId(): string
{
    return (string) random_int(1, 1000000000);
}
