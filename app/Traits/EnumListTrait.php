<?php

namespace App\Traits;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

trait EnumListTrait
{
    public static function list(): Collection
    {
        return collect(self::cases())
            ->map(fn($item) => ['id' => $item->value, 'name' => Str::headline(Str::lower($item->name))]);
    }
}
