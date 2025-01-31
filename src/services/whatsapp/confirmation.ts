import axios from 'axios';

interface Props {
  phoneNumber: string;
  message: string;
  mediaUrl?: string;
}

export const WhatsAppConfirmation = async (props: Props) => {
  const { phoneNumber, message, mediaUrl } = props;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  const data = {
    messaging_product: 'whatsapp',
    to: phoneNumber,
    type: mediaUrl ? 'document' : 'text',
    ...(mediaUrl
      ? { document: { link: mediaUrl, caption: message } }
      : { text: { body: message } }),
  };

  const response = await axios.post(
    `https://graph.facebook.com/v17.0/${phoneId}/messages`,
    data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );
  console.log(response.data);
};
