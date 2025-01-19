const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes'); // Importa as rotas de dados
const caloriasRoutes = require('./routes/caloriasRoutes');
const planoDeTreinoRoutes = require('./routes/planoTreinoRoutes'); // Adiciona as rotas do plano de treino
const solicitacao = require('./routes/solicitacaoRoute.js');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes); // Configura as rotas de dados
app.use('/api/refeicoes', caloriasRoutes);
app.use('/api/planos', planoDeTreinoRoutes); // Configura as rotas do plano de treino
app.use('/api/solicitacao', solicitacao); // Configura as rotas do plano de treino

// Rota inicial (exemplo de teste)
app.get('/', (req, res) => {
  res.send('Servidor estÃ¡ funcionando!');
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});