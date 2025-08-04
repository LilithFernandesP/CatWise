// pages/api/vapi/create-workflow.ts (ou app/api/vapi/create-workflow/route.ts)
import { NextApiRequest, NextApiResponse } from 'next';
import {professorGatinhoWorkflow} from "@/constants/ProfessorGatinhoWorkflow";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const VAPI_API_KEY = process.env.VAPI_SECRET_API_KEY;
    const VAPI_WORKFLOW_ID = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!;
    if (!VAPI_API_KEY) {
        return res.status(500).json({ message: 'VAPI_SECRET_API_KEY not configured' });
    }

    try {
        const response = await fetch('https://api.vapi.ai/workflow/{VAPI_WORKFLOW_ID}', { // Endpoint para criar workflow
            // Se você quiser ATUALIZAR um workflow existente, seria:
            // await fetch(``, { method: 'PUT', ...
            method: 'PUT', // Ou 'PUT' para atualizar
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${VAPI_API_KEY}`,
            },
            body: JSON.stringify(professorGatinhoWorkflow), // Envie o JSON completo do workflow
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro ao criar/atualizar workflow VAPI:', errorData);
            return res.status(response.status).json({ message: 'Failed to create/update VAPI workflow', error: errorData });
        }

        const data = await response.json();
        // 'data' conterá o workflowId e outras informações do workflow criado/atualizado
        // Ex: { "id": "your-new-workflow-id", "name": "classes-generate", ... }
        console.log('Workflow VAPI criado/atualizado com sucesso:', data.id);

        return res.status(200).json({ workflowId: data.id });

    } catch (error) {
        console.error('Erro no servidor ao chamar VAPI API:', error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
}