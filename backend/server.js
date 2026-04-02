const express = require('express');

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'pailos-backend' });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`PAILOS backend listening on ${port}`);
});
