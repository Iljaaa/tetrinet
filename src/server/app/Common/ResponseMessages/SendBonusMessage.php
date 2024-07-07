<?php

namespace App\Common\ResponseMessages;

use App\Common\Types\BonusType;
use App\Common\Types\ResponseType;

/**
 * When someone send bonus to someone
 * so this surprise-message to target player
 */
class SendBonusMessage extends Message
{
    /**
     *
     */
    public function __construct(string $sourcePlayerId, string $targetPlayerId, BonusType $bonus)
    {
        $this->setData('type', ResponseType::getBonus);
        $this->setData('source', $sourcePlayerId);
        $this->setData('target', $targetPlayerId);
        $this->setData('bonus', $bonus->value);
    }
}