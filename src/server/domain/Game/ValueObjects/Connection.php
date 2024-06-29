<?php

namespace Domain\Game\ValueObjects;

use App\Helper;
use Random\RandomException;
use Ratchet\ConnectionInterface as RatchetConnectionInterface;

/**
 * This is wrap around rachet connection
 */
class Connection
{
    public function __construct(private readonly RatchetConnectionInterface $rConn)
    {
    }

    /**
     * Init new connection
     * used when new clint connecting
     * @param RatchetConnectionInterface $rConn
     * @return Connection
     * @throws RandomException
     */
    public static function init(RatchetConnectionInterface $rConn): Connection
    {
        // generate socket is
        $rConn->socketId = generateRandomPlayerId();

        // what this code do?
        // todo: move id into config
        $app = \BeyondCode\LaravelWebSockets\Apps\App::findById("app_id");
        $rConn->app = $app;

        return self::factory($rConn);
    }

    /**
     * @param RatchetConnectionInterface $rConn
     * @return Connection
     */
    public static function factory(RatchetConnectionInterface $rConn): Connection
    {
        return new self($rConn);
    }

    /**
     * @return string
     */
    public function getSocketId(): string
    {
        return $this->rConn->socketId;
    }
}