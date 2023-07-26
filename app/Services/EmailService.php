<?php

namespace App\Services;

use App\Enum\EmailType;
use Webklex\IMAP\Facades\Client;

class EmailService
{
    public \Webklex\PHPIMAP\Client $imapClient;

    public function __construct()
    {
        $this->imapClient = Client::account('default');
        $this->imapClient->connect();
    }

    public function index($type)
    {
        $messageList = [];
//        dd($this->imapClient->getFolders());
        $folder = $this->imapClient->getFolder(EmailType::tryFrom($type)->keyForEmailClient());

        /** @var \Webklex\PHPIMAP\Folder $folder */
        //Get all Messages of the current Mailbox $folder
        /** @var \Webklex\PHPIMAP\Support\MessageCollection $messages */

        if($folder){
            $messages = $folder->messages()->all()->get();

            /** @var \Webklex\PHPIMAP\Message $message */
            foreach ($messages as $message) {
                $messageList[] = [
                    'id' => $message->getUid(),
                    'subject' => $message->getSubject()->first(),
                    'from' => $message->getFrom()[0]->mail,
                    'to' => $message->getTo()[0]->mail,
                    'from_full_name' => $message->getFrom()[0]->personal ?? $message->getFrom()[0]->mail,
                    'date' => $message->getDate()->first()->format('Y-m-d H:i:s'),
                    'body' => $message->getHTMLBody(),
                ];
            }
        }

        return response($messageList);
    }
}
