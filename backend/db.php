<?php

class Db
{
    public $mysqli,
        $messages;
    private $host = 'localhost',
        $username = 'root',
        $password = '',
        $db = 'study';

    public function __construct()
    {
        $this->mysqli = new mysqli($this->host, $this->username, $this->password, $this->db);
    }


    public function insertMessage($data)
    {
        $result = $this->mysqli->query("INSERT into chat(username,text,created_on)VALUES('" . $data['username'] . "','" . $data['text'] . "','" . $data['date'] . "')");
        return $result;
    }

    public function getNewMessage($id)
    {
        $result = $this->mysqli->query("SELECT * FROM chat where id > $id");
        return $this->fetchSql($result);
    }

    public function getMessages()
    {
        $result = $this->mysqli->query("SELECT * from chat ORDER BY id desc limit 5");
        return $this->fetchSql($result);
    }

    public function getOlderMessages($id)
    {
        $result = $this->mysqli->query("SELECT * from chat where id < $id ORDER BY id desc limit 5");
        return $this->fetchSql($result);
    }

    public function fetchSql($result)
    {
        if($result->num_rows == null){
            $this->messages = false;
        }
        while ($obj = $result->fetch_object()) {
            $this->messages['messages'][] = (array)$obj;
        }
        return $this->messages;

    }
}