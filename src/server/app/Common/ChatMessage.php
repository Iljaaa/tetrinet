<?php

namespace app\Common;

use Faker\Core\DateTime;

class ChatMessage
{
    /**
     * @var string
     */
    private string $message = '';

    /**
     * @var string
     */
    private string $playerId = '';

    /**
     * @var DateTime
     */
    private DateTime $date;

    /**
     * @param string $message
     * @param string $playerId
     */
    public function __construct(string $message, string $playerId)
    {
        $this->message = $message;
        $this->playerId = $playerId;
        $this->date = new DateTime();
    }

    /**
     * @return array
     */
    public function asArray (): array
    {
        return [
            'message' => $this->message,
            'playerId' => $this->playerId,
            'date' => $this->date
        ];
    }

}
