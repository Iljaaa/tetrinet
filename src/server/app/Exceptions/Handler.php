<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
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

        $this->registerShutdownFunction();
    }

    /**
     * @return void
     */
    public function registerShutdownFunction()
    {
        register_shutdown_function(function () {
            $error = error_get_last();

            if ($error && $error['type'] === E_ERROR) {
                Log::channel('socket')->info('Fatal error: ' . json_encode($error));
            }
        });
    }

    public function report(Throwable $e)
    {
        parent::report($e);

        if (!$this->shouldReport($e)) {
            return;
        }

        if ($e instanceof NotFoundHttpException || $e instanceof MethodNotAllowedHttpException) {
            return;
        }

        $this->notifyViaTelegram($e);
    }

    /**
     * // todo: make special interface for case if transport changed
     * @param Throwable $e
     * @return void
     */
    private function notifyViaTelegram(\Throwable $e): void
    {
        $messageBot = app('telergambot');
        $messageBot->sendMessage($this->createMessage($e));
    }

    /**
     * @param Throwable $e
     * @return string
     */
    private function createMessage(\Throwable $e)
    {
        return sprintf(
            "There is an exception\n%s\n%s\n%s:%d\n\n%s",
            get_class($e),
            $e->getMessage(),
            $e->getFile(),
            $e->getLine(),
            $this->formatTrace($e->getTrace())
        );
    }

    /**
     * Format the stack trace.
     *
     * @param array $trace
     * @return string
     */
    protected function formatTrace(array $trace): string
    {
        $firstFive = array_slice($trace, 0, 5);

        return implode(PHP_EOL, array_map(function ($item) {
            return sprintf(
                "%s:%s %s",
                $item['file'] ?? "-",
                $item['line'] ?? "-",
                $item['function'] ?? "-"
            );
        }, $firstFive));
    }

}
