<?php

namespace App\Enum;

use App\Traits\EnumListTrait;

enum EmailType: int
{
    use EnumListTrait;

    case Inbox = 1;
    case Sent = 2;
    case Drafts = 3;
    case Trash = 4;
    case Spam = 5;

    public function keyForEmailClient(): string
    {
        return match ($this) {
            EmailType::Inbox => 'INBOX',
            EmailType::Sent => 'Sent',
            EmailType::Drafts => 'Drafts',
            EmailType::Trash => 'Trash',
            EmailType::Spam => 'Spam',
        };
    }

}


