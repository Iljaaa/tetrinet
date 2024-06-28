<?php

namespace App\Providers;

use App\Contracts\Game\PoolOfParties;
use App\Contracts\Game\PoolOfPlayers;
use App\Services\Game\BasePoolOfParties;
use App\Services\Game\BasePoolOfPlayers;
use App\Services\TelegramBotService;
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
