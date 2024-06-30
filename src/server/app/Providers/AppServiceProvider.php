<?php

namespace App\Providers;

use App\Services\TelegramBotService;
use Domain\Game\Aggregates\BasePoolOfParties;
use Domain\Game\Aggregates\BasePoolOfPlayers;
use Domain\Game\Contracts\PoolOfParties;
use Domain\Game\Contracts\PoolOfPlayers;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton('telergambot', function ($app) {
            return new TelegramBotService();
        });

        $this->app->singleton(PoolOfPlayers::class, BasePoolOfPlayers::class);
        $this->app->singleton(PoolOfParties::class, BasePoolOfParties::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
