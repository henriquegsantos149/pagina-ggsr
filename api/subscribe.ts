export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ACTIVE_API_KEY } = process.env;

  if (!ACTIVE_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const {
    nome,
    email,
    telefone,
    formacao,
    area,
    utm_campaign,
    utm_source,
    utm_medium,
    utm_content,
    utm_term
  } = req.body;

  if (!email || !nome) {
    return res.status(400).json({ error: 'Email and name are required' });
  }

  const baseUrl = 'https://ambientalpro.api-us1.com/api/3';
  
  // Extrair firstName (apenas o primeiro nome) para melhor formatação no AC
  const firstName = nome.split(' ')[0];
  const lastName = nome.substring(firstName.length).trim() || '';

  try {
    // 1. Sincronizar (Criar ou Atualizar) Contato
    const contactPayload = {
      contact: {
        email,
        firstName,
        lastName,
        phone: telefone || '',
        fieldValues: [
          { field: '395', value: utm_campaign || '' },
          { field: '396', value: utm_source || '' },
          { field: '397', value: utm_medium || '' },
          { field: '398', value: utm_content || '' },
          { field: '399', value: utm_term || '' },
          { field: '401', value: new Date().toISOString() },
          { field: '402', value: formacao || '' },
          { field: '403', value: area || '' }
        ]
      }
    };

    const syncRes = await fetch(`${baseUrl}/contact/sync`, {
      method: 'POST',
      headers: {
        'Api-Token': ACTIVE_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactPayload)
    });

    if (!syncRes.ok) {
      const errorText = await syncRes.text();
      throw new Error(`Failed to sync contact: ${errorText}`);
    }

    const syncData = (await syncRes.json()) as { contact: { id: string } };
    const contactId = syncData.contact.id;

    // 2. Adicionar Tag ao Contato: 237 - [PÓS] [GEOPROCESSAMENTO] Interessado
    const tagPayload = {
      contactTag: {
        contact: contactId,
        tag: '237'
      }
    };

    const tagRes = await fetch(`${baseUrl}/contactTags`, {
      method: 'POST',
      headers: {
        'Api-Token': ACTIVE_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tagPayload)
    });

    if (!tagRes.ok) {
      const errorText = await tagRes.text();
      console.error(`Failed to add tag: ${errorText}`);
      // Não lançamos erro aqui para não falhar a requisição principal de criação caso apenas a tag falhe.
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('ActiveCampaign Integration Error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
