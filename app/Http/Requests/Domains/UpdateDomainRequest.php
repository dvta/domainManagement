<?php

namespace App\Http\Requests\Domains;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDomainRequest extends FormRequest
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
            'domain' => ['required', 'string'],
            'path' => ['required', 'string'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'action' => 'domain/changedomainpath'
        ]);
    }
}
