interface WhatsAppTemplate {
  name: string;
  language: {
    code: string;
  };
  components?: Array<{
    type: string;
    parameters: Array<Record<string, any>>;
  }>;
}

interface WhatsAppMessage {
  messaging_product: string;
  recipient_type: string;
  to: string;
  type: string;
  text?: {
    preview_url?: boolean;
    body: string;
  };
  template?: WhatsAppTemplate;
}

const getApiConfig = () => {
  const accessToken = process.env.NEXT_PUBLIC_WHATSAPP_TOKEN || '';
  const phoneNumberId = process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER_ID || '';
  const apiUrl = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;

  return {
    accessToken,
    apiUrl,
  };
};

export async function sendTextMessage(to: string, message: string): Promise<any> {
  console.log('Sending text message to:', to);
  const { accessToken, apiUrl } = getApiConfig();

  try {
    const messageData: WhatsAppMessage = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: {
        preview_url: false,
        body: message,
      },
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`WhatsApp API Error: ${JSON.stringify(errorData)}`);
    }

    const responseData = await response.json();
    console.log('responseData', responseData);

    return responseData;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
}

export async function sendTemplateMessage(
  to: string,
  templateName: string,
  languageCode: string = 'en',
  components?: WhatsAppTemplate['components']
): Promise<any> {
  const { accessToken, apiUrl } = getApiConfig();

  try {
    const messageData: WhatsAppMessage = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'template',
      template: {
        name: templateName,
        language: {
          code: languageCode,
        },
      },
    };

    if (components) {
      messageData.template = {
        name: templateName,
        language: {
          code: languageCode
        },
        components
      };
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`WhatsApp API Error: ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending WhatsApp template message:', error);
    throw error;
  }
}
