<?php

namespace App\Common\ResponseMessages;

use App\Common\Types\ResponseType;

class BackToPartyResponseMessage extends ResponseMessage
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
