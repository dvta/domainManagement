<?php

namespace App\Http\Controllers;

use App\Http\Requests\Domains\DestroyDomainRequest;
use App\Http\Requests\Domains\DomainListRequest;
use App\Http\Requests\Domains\StoreDomainRequest;
use App\Http\Requests\Domains\UpdateDomainRequest;
use App\Traits\ApiTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class DomainController extends Controller
{
    use ApiTrait;

    /**
     * Display a listing of the resource.
     */
    public function index(DomainListRequest $request)
    {
        return response(
            $this->sendRequest($request->validated())
        );
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDomainRequest $request)
    {
        return response(
            $this->sendRequest($request->validated())
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }


    /**
     * Update the specified resource in storage.
     */
    public function updatePath(UpdateDomainRequest $request)
    {
        return response(
            $this->sendRequest($request->validated())
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DestroyDomainRequest $request)
    {
        return response(
            $this->sendRequest($request->validated())
        );
    }
}
