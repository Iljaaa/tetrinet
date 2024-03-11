<?php

namespace App\Exceptions;

use App\Services\TelegramBotService;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * @return void
     */
    public function registerShutdownFunction()
    {
        $error = error_get_last();

        // Проверяем, была ли ошибка и нужно ли выполнить какие-либо действия
        if ($error && $error['type'] === E_ERROR) {

            // ВЫПОЛНЯЕМ ВАШУ ФУНКЦИЮ ЗДЕСЬ

        }


        Log::channel('socket')->info('this is '.__METHOD__);
    }

    public function report(Throwable $e)
    {
        $parentResult = parent::report($e);

        if ($e instanceof NotFoundHttpException){
            return $parentResult;
        }

        $t  = 'There is exception'.PHP_EOL;
        $t .= get_class($e).PHP_EOL;
        $t .= $e->getMessage().PHP_EOL;
        $t .= $e->getFile().':'.$e->getLine().PHP_EOL.PHP_EOL;
        // $t .= $e->getTraceAsString().PHP_EOL;
        $firstFive = array_slice($e->getTrace(), 0, 5);
        $t .= implode(PHP_EOL, array_map(fn ($l) => $l['file'].':'.$l['line'].' '.$l['function'], $firstFive));

        $messageBot = app('telergambot');
        $messageBot->sendMessage($t);

        return $parentResult;
    }



}
