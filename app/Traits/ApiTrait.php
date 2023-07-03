<?php

namespace App\Traits;

use Illuminate\Support\Facades\Http;

trait ApiTrait
{
    protected function sendRequest(array $params)
    {
        if (isset($params)){
            $params = array_merge($params, [
                'token' => config('services.spanel.token'),
                'accountuser' => config('services.spanel.user')
            ]);
        }

        $url = config('services.spanel.url');


        return Http::asForm()
            ->withHeader('Accept', 'application/json')
            ->post($url, $params)
            ->json();
    }
}
