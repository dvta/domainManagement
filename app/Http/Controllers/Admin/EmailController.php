<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Emails\DestroyEmailRequest;
use App\Http\Requests\Emails\EmailListRequest;
use App\Http\Requests\Emails\StoreEmailRequest;
use App\Http\Requests\Emails\UpdateEmailPasswordRequest;
use App\Http\Requests\Emails\UpdateEmailQuotaRequest;
use App\Traits\ApiTrait;

class EmailController extends Controller
{
    use ApiTrait;
    /**
     * Display a listing of the resource.
     */
    public function index(EmailListRequest $request)
    {
        return response(
            $this->sendRequest($request->validated())
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEmailRequest $request)
    {
        return $this->sendRequest(
            $request->validated()
        );
    }

    public function changeQuota(UpdateEmailQuotaRequest $request)
    {
        return response(
            $this->sendRequest($request->validated())
        );
    }

    public function changePassword(UpdateEmailPasswordRequest $request)
    {
        return response(
            $this->sendRequest($request->validated())
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DestroyEmailRequest $request)
    {
        return response(
            $this->sendRequest($request->validated())
        );
    }
}
