<?php

namespace App\Common\Messages;

use App\Common\ChatMessage;
use App\Common\Types\ResponseType;

class UpdateChatMessage extends Message
{

    /**
     * @param string $partyId
     * @param ChatMessage[] $chat
     */
    public function __construct(string $partyId, array $chat)
    {
        $this->setData('type', ResponseType::chat);
        $this->setPartyId($partyId);
        $this->setData('chat', array_map(fn(ChatMessage $c) => $c->asArray(), $chat));
    }
}
