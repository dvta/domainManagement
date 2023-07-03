<?php

namespace App\Http\Requests\Emails;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmailQuotaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'action' => ['required', 'string'],
            'email' => ['required', 'string'],
            'quota' => ['required', 'integer'],
        ];
    }

    public function prepareForValidation(): void
    {
        $this->merge([
            'action' => 'email/changeemailquota'
        ]);
    }
}
