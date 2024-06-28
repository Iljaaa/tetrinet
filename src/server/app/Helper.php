<?php

namespace App;

use App\Common\Types\BonusType;

/**
 *
 */
class Helper
{
    /**
     * Todo: move to stand alone function
     * Generate random string for socket(playerId) and partyId
     * @return string
     */
    public static function random (): string
    {
        // return sprintf('%d.%d', random_int(1, 1000000000), random_int(1, 1000000000));
        return (string) random_int(1, 1000000000);
    }

    /**
     * Todo: move to stand alone function
     * User friendly
     * @param BonusType $b
     * @return string
     */
    public static function GetNiceBlockName (BonusType $b): string
    {
        return match ($b) {
            BonusType::add => 'add line',
            BonusType::clear => 'clear line',
            BonusType::clearSpecials => 'clear specials',
            BonusType::randomClear => 'random clear',
            BonusType::blockBomb => 'block bomb',
            BonusType::blockQuake => 'blocks quake',
            BonusType::gravity => 'gravity',
            BonusType::switch => 'switch cups',
            BonusType::nuke => 'nuke',
            BonusType::darkness => 'darkness',
            default => $b->name,
        };
    }
}
