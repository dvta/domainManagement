<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Redirects\DestroyRedirectRequest;
use App\Http\Requests\Redirects\RedirectListRequest;
use App\Http\Requests\Redirects\StoreRedirectRequest;
use App\Traits\ApiTrait;

class RedirectController extends Controller
{
    use ApiTrait;
    /**
     * Display a listing of the resource.
     */
    public function index(RedirectListRequest $request)
    {
        return response(
          $this->sendRequest($request->validated())
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRedirectRequest $request)
    {
        return response(
            $this->sendRequest($request->validated())
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DestroyRedirectRequest $request)
    {
        return response(
            $this->sendRequest($request->validated())
        );
    }
}
