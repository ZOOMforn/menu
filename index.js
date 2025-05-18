// Importando as bibliotecas necessárias
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();
const PORT = 3000;

// Configuração do bot Discord
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const BOT_TOKEN = 'MTM3MzQ1ODgzNjczNTkxODE2Mg.Gs7QfJ.XO6Ce8maGAKr90u_K5zF30Wa4mggvJmf1Djks4';

// Armazenamento de keys em memória
let keys = {};

// Função para gerar uma key aleatória
function generateKey() {
  return Math.random().toString(36).substring(2, 15);
}

// Comando para gerar uma nova key
client.on('messageCreate', (message) => {
  if (message.content.startsWith('!key')) {
    const args = message.content.split(' ');
    const duration = parseInt(args[1], 10) || 60;
    const key = generateKey();
    const expires = Date.now() + duration * 60000;
    keys[key] = expires;
    message.reply(`Key gerada: ${key} (válida por ${duration} minutos)`);
  }
});

// Servidor HTTP para validação
app.get('/validate', (req, res) => {
  const key = req.query.key;
  if (!key) return res.json({ valid: false, message: 'Key não fornecida' });

  const expiration = keys[key];
  if (expiration && Date.now() < expiration) {
    res.json({ valid: true, expiresIn: (expiration - Date.now()) / 1000 });
  } else {
    res.json({ valid: false, message: 'Key inválida ou expirada' });
  }
});

// Inicializando o servidor HTTP
app.listen(PORT, () => {
  console.log(`Servidor HTTP rodando em http://localhost:${PORT}`);
});

// Inicializando o bot Discord
client.login(BOT_TOKEN);
