<?php

namespace App\Common\Messages;

use App\Common\Party;

class Message
{
    /**
     * @var array
     */
    protected array $data = [];

    /**
     * this is chat
     * @var array
     */
    protected array $chat = [];

    /**
     * @param string $key
     * @param mixed $value
     * @return $this
     */
    protected function setData (string $key, mixed $value): static {
        $this->data[$key] = $value;
        return $this;
    }

    protected function setPartyId (string $party)
    {
        $this->data['partyId'] = $party;
    }

    /**
     * @param Party $party
     * @return Message
     */
    public function setChat(Party $party): static {
        return $this->setData('chat', $party->getChat());
    }

    /*
     * @return void
     */
//    public function setData ()
//    {
//
//    }

    /**
     * @return string
     */
    public function getDataAsString(): string {
        return json_encode($this->data);
    }

}