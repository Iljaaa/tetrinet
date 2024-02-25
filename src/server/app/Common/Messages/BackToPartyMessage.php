<?php

namespace App\Common\Messages;

use App\Common\Party;
use App\Common\Types\ResponseType;

class BackToPartyMessage extends Message
{

    /**
     *
     */
    public function __construct()
    {
        $this->setData('type', ResponseType::backToParty);
    }

    /**
     * @param string $message
     * @return void
     */
    public function partyNotFound(string $message): void
    {
        $this->setData('success', false)
            ->setData('message', $message);
    }

    public function setCupsResponseData (array $date): void
    {
        $this->setData('cups', $date);
    }
}
