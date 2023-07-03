<?php

namespace App\Http\Requests\Redirects;

use App\Rules\StringOrArrayRule;
use Illuminate\Foundation\Http\FormRequest;

class DestroyRedirectRequest extends FormRequest
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
            'source' => ['required', new StringOrArrayRule()],
        ];
    }

    public function prepareForValidation():void
    {
        $this->merge([
            'action' => 'domain/removeredirect',
        ]);
    }
}
