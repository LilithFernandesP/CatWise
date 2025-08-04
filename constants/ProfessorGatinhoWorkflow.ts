export const professorGatinhoWorkflow =
    {
        "name": "classes-generate",
        "nodes": [
            {
                "name": "conversation_1749519005456",
                "type": "conversation",
                "isStart": true,
                "metadata": {
                    "position": {
                        "x": -381.1414392381165,
                        "y": -393.6544016623699
                    }
                },
                "prompt": "Você é o Professor Gatinho, um professor bem humorado e amigável que ajuda os alunos a se prepararem para testes realizando aulas e quizzes. Você os recebe calorosamente e guia eles com perguntas sempre encorajando a interação. Fale claramente e com bondade. Receba o aluno em sua sala e diga para se preparar para criar a sua aula, perguntando qual o **tema**, a **dificuldade** (em uma escala de 1 a 5) e o **número de perguntas** que ele gostaria de ter.",
                "model": {
                    "model": "gpt-4o",
                    "provider": "openai",
                    "maxTokens": 1000,
                    "temperature": 0.7
                },
                "voice": {
                    "model": "eleven_turbo_v2_5",
                    "style": 0,
                    "voiceId": "9pDzHy2OpOgeXM8SeL0t",
                    "language": "pt",
                    "provider": "11labs",
                    "useSpeakerBoost": true,
                    "enableSsmlParsing": true
                },
                "transcriber": {
                    "model": "scribe_v1",
                    "language": "pt",
                    "provider": "11labs"
                },
                "variableExtractionPlan": {
                    "output": [
                        {
                            "enum": [],
                            "type": "string",
                            "title": "theme",
                            "description": "the theme of the quiz"
                        },
                        {
                            "enum": [],
                            "type": "string",
                            "title": "level",
                            "description": "the difficulty of the quiz (e.g., easy, medium, hard, or a number from 1 to 5)"
                        },
                        {
                            "enum": [],
                            "type": "string",
                            "title": "amount",
                            "description": "amount of questions for the quiz"
                        }
                    ]
                },
                "messagePlan": {
                    "firstMessage": "Olá! Seja bem-vindo à minha sala de aula. Sou o Professor Gatinho e estou aqui para te ajudar a criar a aula perfeita. Para começarmos, qual o **tema** da sua aula, qual a **dificuldade** que você prefere (de 1 a 5) e quantas **perguntas** teremos?"
                }
            },
            {
                "name": "API Request",
                "type": "tool",
                "metadata": {
                    "position": {
                        "x": -395.50924472638053,
                        "y": 229.23452976492092
                    }
                },
                "tool": {
                    "url": "https://prepwiseproject1-gms438azp-lilithfernandesps-projects.vercel.app/api/vapi/generate",
                    "body": {
                        "type": "object",
                        "required": [
                            "level",
                            "theme",
                            "amount",
                            "userId",
                            "area",
                            "purpose"
                        ],
                        "properties": {
                            "area": {
                                "type": "string",
                                "value": "{{area}}",
                                "description": ""
                            },
                            "level": {
                                "type": "string",
                                "value": "{{level}}",
                                "description": ""
                            },
                            "theme": {
                                "type": "string",
                                "value": "{{theme}}",
                                "description": ""
                            },
                            "amount": {
                                "type": "string",
                                "value": "{{amount}}",
                                "description": ""
                            },
                            "userId": {
                                "type": "string",
                                "value": "{{userId}}",
                                "description": ""
                            },
                            "purpose": {
                                "type": "string",
                                "value": "{{purpose}}",
                                "description": ""
                            }
                        }
                    },
                    "name": "api",
                    "type": "apiRequest",
                    "method": "POST",
                    "function": {
                        "name": "untitled_tool",
                        "parameters": {
                            "type": "object",
                            "required": [],
                            "properties": {}
                        }
                    },
                    "messages": [
                        {
                            "role": "assistant",
                            "type": "request-complete",
                            "content": "Sucesso",
                            "endCallAfterSpokenEnabled": false
                        }
                    ]
                }
            },
            {
                "name": "conversation_1749519317238",
                "type": "conversation",
                "metadata": {
                    "position": {
                        "x": -398.1986983606836,
                        "y": 465.090611154637
                    }
                },
                "prompt": "Como o Professor Gatinho, diga que a aula está pronta. Comente que você estará esperando na sala ao lado para quando o aluno estiver preparado para realizar a aula, e encoraje-o a se preparar.",
                "model": {
                    "model": "eleven_turbo_v2_5",
                    "voiceId": "9pDzHy2OpOgeXM8SeL0t",
                    "provider": "11labs",
                    "useSpeakerBoost": true,
                    "language": "pt"
                },
                "transcriber": {
                    "model": "scribe_v1",
                    "language": "pt",
                    "provider": "11labs"
                },
                "messagePlan": {
                    "firstMessage": "Excelente! A sua aula está prontinha! Eu estarei te esperando na sala ao lado para quando você estiver preparado para começar. Respire fundo e venha quando quiser!"
                }
            },
            {
                "name": "hangup_1749519344030",
                "type": "tool",
                "metadata": {
                    "position": {
                        "x": -261.2167844358951,
                        "y": 799.2735092882393
                    }
                },
                "tool": {
                    "type": "endCall"
                }
            },
            {
                "name": "conversation_1749567244749",
                "type": "conversation",
                "metadata": {
                    "position": {
                        "x": -389.46851884176715,
                        "y": -95.571217516346
                    }
                },
                "prompt": "Como o Professor Gatinho, com seu tom amigável e encorajador, pergunte ao aluno qual a área de interesse dentro do tema escolhido por ele. Além disso, pergunte qual o propósito geral da aula: se é para estudar, testar conhecimentos, ou apenas por diversão.",
                "model": {
                    "model": "gpt-4o",
                    "provider": "openai",
                    "maxTokens": 1000,
                    "temperature": 0.7
                },
                "voice": {
                    "model": "eleven_turbo_v2_5",
                    "voiceId": "9pDzHy2OpOgeXM8SeL0t",
                    "autoMode": true,
                    "language": "pt",
                    "provider": "11labs"
                },
                "transcriber": {
                    "model": "scribe_v1",
                    "language": "pt",
                    "provider": "11labs"
                },
                "variableExtractionPlan": {
                    "output": [
                        {
                            "enum": [],
                            "type": "string",
                            "title": "area",
                            "description": "area of interest inside the {{theme}}"
                        },
                        {
                            "enum": [],
                            "type": "string",
                            "title": "purpose",
                            "description": "what is the meaning of the quiz, learn, test knowledge, or fun"
                        }
                    ]
                },
                "messagePlan": {
                    "firstMessage": "Agora que já definimos o básico, para deixar nossa aula ainda mais interessante, me diga: dentro de {{theme}}, qual a área de interesse que você mais gosta? E qual o seu objetivo com essa aula? É para estudar, testar seus conhecimentos, ou apenas se divertir um pouco?"
                }
            }
        ],
        "edges": [
            {
                "from": "API Request",
                "to": "conversation_1749519317238",
                "condition": {
                    "type": "ai",
                    "prompt": "if the API call was successful"
                }
            },
            {
                "from": "conversation_1749519317238",
                "to": "hangup_1749519344030",
                "condition": {
                    "type": "ai",
                    "prompt": "if the user says goodbye, or if the conversation has reached a natural conclusion and there's no further interaction needed"
                }
            },
            {
                "from": "conversation_1749519005456",
                "to": "conversation_1749567244749",
                "condition": {
                    "type": "ai",
                    "prompt": "user has provided the theme, level, and amount of questions"
                }
            },
            {
                "from": "conversation_1749567244749",
                "to": "API Request",
                "condition": {
                    "type": "ai",
                    "prompt": "user has provided the area of interest and the purpose"
                }
            }
        ],
        "globalPrompt": "Você é o Professor Gatinho, um professor bem humorado e amigável que ajuda os alunos a se prepararem para testes realizando aulas e quizzes. Você os recebe calorosamente e guia eles com perguntas sempre encorajando a interação. Fale claramente e com bondade."
    }