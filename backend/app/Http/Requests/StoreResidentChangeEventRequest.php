<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * 住民異動イベントの手入力登録リクエスト。
 */
class StoreResidentChangeEventRequest extends FormRequest
{
    /** 取り込める異動種別 */
    private const EVENT_TYPES = [
        'AGE_65',
        'MOVE_IN',
        'MOVE_OUT',
        'DEATH',
        'ADDRESS_CHANGE',
        'NAME_CHANGE',
    ];

    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'event_uid' => ['required', 'string', 'max:64', 'unique:resident_change_events,event_uid'],
            'municipality_code' => ['required', 'string', 'max:6'],
            'resident_no' => ['required', 'string', 'max:32'],
            'event_type' => ['required', 'string', Rule::in(self::EVENT_TYPES)],
            'event_date' => ['required', 'date'],
            'qualification_reason_code' => ['nullable', 'string', 'max:8'],
            'name' => ['required', 'string', 'max:100'],
            'kana' => ['nullable', 'string', 'max:200'],
            'birth_date' => ['required', 'date'],
            'gender_code' => ['nullable', 'string', 'max:1'],
            'postal_code' => ['nullable', 'string', 'max:8'],
            'pref_name' => ['nullable', 'string', 'max:20'],
            'city_name' => ['nullable', 'string', 'max:40'],
            'town_name' => ['nullable', 'string', 'max:80'],
            'addr_line' => ['nullable', 'string', 'max:200'],
            'addr_building' => ['nullable', 'string', 'max:200'],
            'care_application_in_progress' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'event_uid.required' => 'イベントIDは必須です。',
            'event_uid.unique' => '同じイベントIDは既に登録されています。',
            'municipality_code.required' => '自治体コードは必須です。',
            'resident_no.required' => '住民番号は必須です。',
            'event_type.required' => '異動種別は必須です。',
            'event_type.in' => '異動種別の値が不正です。',
            'event_date.required' => '異動日は必須です。',
            'name.required' => '氏名は必須です。',
            'birth_date.required' => '生年月日は必須です。',
        ];
    }
}
