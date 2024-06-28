<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @property numeric $id
 * @property string $variant
 * @property string $name
 * @property string $email
 * @property string $message
 */
class FeedbackRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'variant' => [
                'required',
                'string',
                'min:1',
                // fn($attribute, $value, $fail) => $this->validateOffer($attribute, $value, $fail),
            ],
        ];
    }

}
