<?php

namespace App\Providers;

use App\Application;
use BeyondCode\LaravelWebSockets\Apps\App;
use BeyondCode\LaravelWebSockets\Apps\AppProvider;


class MyCustomAppProvider implements AppProvider
{
    public function all() : array
    {
        return [];
//            Application::all()
//            ->map(function($app) {
//                return $this->instanciate($app->toArray());
//            })
//            ->toArray();
    }

    public function findById($appId) : ? App
    {
        return null;
        // return  $this->instanciate(Application::findById($appId)->toArray());
    }

    public function findByKey(string $appKey) : ? App
    {
        return null;
        //return $this->instanciate(Application::findByKey($appKey)->toArray());
    }

    public function findBySecret(string $appSecret) : ? App
    {
        return null;
        // return $this->instanciate(Application::findBySecret($appSecret)->toArray());
    }

    protected function instanciate(?array $appAttributes) : ? App
    {
        if (!$appAttributes) {
            return null;
        }

        $app = new App(
            $appAttributes['id'],
            $appAttributes['key'],
            $appAttributes['secret']
        );

        if (isset($appAttributes['name'])) {
            $app->setName($appAttributes['name']);
        }

        if (isset($appAttributes['host'])) {
            $app->setHost($appAttributes['host']);
        }

        $app
            ->enableClientMessages($appAttributes['enable_client_messages'])
            ->enableStatistics($appAttributes['enable_statistics']);

        return $app;
    }
}
