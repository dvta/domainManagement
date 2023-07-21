<?php

use App\Http\Controllers\Admin\DomainController;
use App\Http\Controllers\Admin\EmailController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

//Domains
Route::apiResource('domains', DomainController::class)->only('index', 'store');
Route::patch('domains/update-path', [DomainController::class, 'updatePath']);
Route::delete('domains', [DomainController::class, 'destroy']);

//Redirects - not implemented
//Route::apiResource('redirects', RedirectController::class)->only('index', 'store');
//Route::delete('redirects', [RedirectController::class, 'destroy']);

//Emails
Route::apiResource('emails', EmailController::class)->only('index', 'store');
Route::controller(EmailController::class)->group(function () {
    Route::delete('emails', 'destroy');
    Route::patch('emails/change-quota', 'changeQuota');
    Route::patch('emails/change-password', 'changePassword');
});


Route::get('user/email/inbox', [EmailController::class, 'inbox']);
