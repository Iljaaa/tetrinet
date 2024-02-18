<?php

namespace App\Common;

class Helper
{
    /**
     * @return string
     */
    public static function random (): string
    {
        // return sprintf('%d.%d', random_int(1, 1000000000), random_int(1, 1000000000));
        return (string) random_int(1, 1000000000);
    }
}
