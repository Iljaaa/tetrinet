<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class Server extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'server:start';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Start tetrinet server';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // we fork it server
        Log::channel('socket')->info('We fork this process to start server');

        Log::channel('socket')->info('Exit parent process');
    }
}
