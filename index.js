import express from 'express';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const app = express();
const port = process.env.PORT || 3000; // Use a porta definida pela Railway

// Configurar o Mercado Pago
const client = new MercadoPagoConfig({ accessToken: 'TEST-3558795084321893-081615-18c02cd9180cdb899845724bb63ebb92-322855810' });
const preference = new Preference(client);

app.get('/api/payment-url', async (req, res) => {
  try {
    // Extrair parâmetros da query string
    const title = req.query.title;
    const quantity = parseInt(req.query.quantity, 10);
    const unit_price = parseFloat(req.query.unit_price);

    if (!title || isNaN(quantity) || isNaN(unit_price)) {
      return res.status(400).json({ error: 'Parâmetros inválidos. Certifique-se de fornecer título, quantidade e preço unitário.' });
    }

    // Criação da preferência
    const response = await preference.create({
      body: {
        items: [
          {
            title: title,
            quantity: quantity,
            unit_price: unit_price
          }
        ]
      }
    });

    // Log da resposta completa para depuração
    console.log('Resposta completa:', response);

    // Extraindo a URL diretamente da resposta
    const paymentUrl = response.init_point;

    if (paymentUrl) {
      res.json({ payment_url: paymentUrl });
    } else {
      res.status(500).json({ error: 'Não foi possível encontrar a URL de pagamento' });
    }
  } catch (error) {
    console.error('Erro ao criar a preferência:', error);
    res.status(500).json({ error: 'Erro ao criar a preferência' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
