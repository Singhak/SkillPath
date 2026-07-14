<?php
require_once 'config.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$topic = $data["topic"] ?? "";
$userRole = $data["userRole"] ?? "software engineering";

$systemPrompt = <<<PROMPT
You are an AI interviewer. Your task is to generate 5 interview questions based on the provided topic.
The questions should be suitable for a technical interview for a {$userRole} role.

Return JSON only.

Example:

{
  "questions":[
    {
      "id":1,
      "text":"What is dependency injection in Angular?"
    }
  ]
}
PROMPT;

$body = [
    "model" => $model,
    "temperature" => 0.7,
    "response_format" => [
        "type" => "json_object"
    ],
    "messages" => [
        [
            "role"=>"system",
            "content"=>$systemPrompt
        ],
        [
            "role"=>"user",
            "content"=>"Topic: ".$topic
        ]
    ]
];

$ch = curl_init("https://api.groq.com/openai/v1/chat/completions");

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer ".$apiKey,
        "Content-Type: application/json"
    ],
    CURLOPT_POSTFIELDS => json_encode($body)
]);

$response = curl_exec($ch);

curl_close($ch);

$result = json_decode($response, true);

$content = json_decode($result["choices"][0]["message"]["content"], true);

echo json_encode($content["questions"]);