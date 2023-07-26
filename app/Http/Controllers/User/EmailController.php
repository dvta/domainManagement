<?php

namespace App\Http\Controllers\User;

use App\Enum\EmailType;
use App\Http\Controllers\Controller;
use App\Services\EmailService;
use Illuminate\Http\Request;
use Webklex\IMAP\Facades\Client;

class EmailController extends Controller
{
    public function __construct(public EmailService $emailService)
    {}

    public function index(Request $request)
    {
        $type = $request->type ?? EmailType::Inbox->value;

        return $this->emailService->index($type);
    }

    public function filters()
    {
        return response([
            'emailTypes' => EmailType::list()
        ]);
    }

    public function show()
    {
        return response([]);
    }
}
