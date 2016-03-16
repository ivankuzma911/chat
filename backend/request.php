<?php
include('db.php');

class Request
{
    public $db;

    public function __construct()
    {
        $this->db = new Db();
        $this->parseUrl();
    }

    public function parseUrl()
    {
        if(!empty($_GET)){
            if(isset($_GET['getMessages'])){
                if($_GET['getMessages'] == 'true'){
                    $messages = $this->db->getMessages();
                }else{
                    $messages = $this->db->getOlderMessages($_GET['getMessages']);
                }
            }
            if(isset($_GET['newMessage'])){
                $messages = $this->db->getNewMessage($_GET['newMessage']);
            }
            echo json_encode($messages);
        }

        if (!empty($_POST)) {
            $data['date'] = date('Y-m-d');
            $data['text'] = $_POST['text'];
            $data['username'] = $_POST['username'];
            $this->db->insertMessage($data);
        }
    }
}

$obj = new Request();