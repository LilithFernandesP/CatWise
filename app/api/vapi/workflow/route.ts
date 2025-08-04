// app/api/vapi/workflow/route.ts
import { NextResponse } from 'next/server';
import {professorGatinhoWorkflow} from "@/constants/ProfessorGatinhoWorkflow";


// Defina o ID do workflow VAPI se você já o tiver criado.
// Caso contrário, deixe como null e o endpoint irá criá-lo.
// É altamente recomendado que você crie o workflow UMA ÚNICA VEZ e armazene o ID.
const EXISTING_VAPI_WORKFLOW_ID = process.env.VAPI_WORKFLOW_ID_PROFESSOR_GATINHO || null;

export async function POST(request: Request) {
    const VAPI_SECRET_API_KEY = process.env.VAPI_SECRET_API_KEY;

    if (!VAPI_SECRET_API_KEY) {
        return NextResponse.json({ message: 'VAPI_SECRET_API_KEY not configured' }, { status: 500 });
    }

    const VAPI_API_URL = 'https://api.vapi.ai/workflow';
    let method = 'POST';
    let url = VAPI_API_URL;

    if (EXISTING_VAPI_WORKFLOW_ID) {
        // Se o workflow já existe, vamos tentar atualizá-lo
        method = 'PATCH';
        url = `${VAPI_API_URL}/${EXISTING_VAPI_WORKFLOW_ID}`;
        console.log(`Tentando ATUALIZAR workflow VAPI existente: ${EXISTING_VAPI_WORKFLOW_ID}`);
    } else {
        console.log('Tentando CRIAR novo workflow VAPI...');
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${VAPI_SECRET_API_KEY}`,
            },
            body: JSON.stringify(professorGatinhoWorkflow),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro ao operar no workflow VAPI:', errorData);
            return NextResponse.json(
                { message: 'Falha ao operar no workflow VAPI', error: errorData },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log(`Operação no workflow VAPI ${method === 'POST' ? 'criada' : 'atualizada'} com sucesso. ID:`, data.id);

        // Se estiver criando, você pode querer persistir esse ID em um .env para futuras execuções
        if (method === 'POST') {
            console.log(`NOVO WORKFLOW ID: ${data.id}. Considere adicioná-lo ao seu .env como VAPI_WORKFLOW_ID_PROFESSOR_GATINHO.`);
        }

        return NextResponse.json({ workflowId: data.id }, { status: 200 });

    } catch (error) {
        console.error('Erro interno do servidor ao chamar VAPI API:', error);
        return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
    }
}

// Este endpoint não precisa de GET para o seu caso, mas é bom ter uma estrutura de API Route completa.
export async function GET(request: Request) {
    return NextResponse.json({ message: 'Método GET não suportado para esta rota.' }, { status: 405 });
}