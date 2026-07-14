<?php
require_once 'config.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$question = $data["question"] ?? "";
$answer = $data["answer"] ?? "";

$systemPrompt = <<<PROMPT
You are an AI interviewer evaluating a candidate's answer.

Return JSON only.

{
"score":90,
"feedback":"...",
"idealAnswer":"..."
}
PROMPT;

$body = [
    "model"=>$model,
    "temperature"=>0.5,
    "response_format"=>[
        "type"=>"json_object"
    ],
    "messages"=>[
        [
            "role"=>"system",
            "content"=>$systemPrompt
        ],
        [
            "role"=>"user",
            "content"=>"Question: {$question}\n\nCandidate Answer: {$answer}"
        ]
    ]
];

$ch = curl_init("https://api.groq.com/openai/v1/chat/completions");

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER=>true,
    CURLOPT_POST=>true,
    CURLOPT_HTTPHEADER=>[
        "Authorization: Bearer ".$apiKey,
        "Content-Type: application/json"
    ],
    CURLOPT_POSTFIELDS=>json_encode($body)
]);

$response = curl_exec($ch);

curl_close($ch);

$result = json_decode($response, true);

$content = json_decode($result["choices"][0]["message"]["content"], true);

echo json_encode($content);