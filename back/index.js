// ---------- Importando bibliotecas necessárias -------------------
const express = require('express')
const app = express()
const cors = require('cors')
const { createServer } = require('http')
const { Server } = require('socket.io')
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')

const PORT = 3000
const hostname = 'localhost'

// Configuração do CORS para o Express e Socket.IO
const corsConfiguracao = {
    origin: 'http://127.0.0.1:5500', // Permitir requisições do frontend
    methods: ['GET', 'POST'],
}

app.use(cors(corsConfiguracao))
app.use(express.json()) // Permite trabalhar com JSON nas requisições

// Criar servidor HTTP usando o Express
const server = createServer(app)

// Configuração do Socket.IO com CORS
const io = new Server(server, {
    cors: corsConfiguracao, // Reutilizar as opções de CORS
})


// Iniciar o servidor
server.listen(PORT, hostname, () => {
    console.log(`Servidor rodando em ${hostname}:${PORT}`)
})

// Configuração da comunicação serial
const port = new SerialPort({ path: 'COM8', baudRate: 9600 })
const dadosLer = port.pipe(new ReadlineParser({ delimiter: '\n' }))

port.on('open', () => {
    console.log('Conexão com porta serial com sucesso!')
})

port.on('error', (err) => {
    console.error('Erro na porta Serial', err)
})

let dadosMaisRecentes = null

// Leitura dos dados enviados pelo Arduino
dadosLer.on('data', (dados) => {
    const mensagem = dados.trim() // Ler a mensagem enviada pelo Arduino
    console.log("Recebido do Arduino:", mensagem)
    if (mensagem === "LED_ON") {
        dadosMaisRecentes = { valor: "LED ligado" }
    } else if (mensagem === "LED_OFF") {
        dadosMaisRecentes = { valor: "LED desligado" }
    }

    io.emit('confirmacaoLed', dadosMaisRecentes.valor) // Enviar confirmação para o frontend via Socket.IO
})

// Endpoint para pegar os dados mais recentes do Arduino
app.get('/led', (req, res) => {
    res.status(200).json(dadosMaisRecentes)
})

// Endpoint para controlar o LED
app.post('/led', (req, res) => {
    const dados = req.body // Lendo o status enviado pelo frontend ('on' ou 'off')
    console.log(dados)

    if (dados.status === 'on') {
        port.write('1') // Enviar comando para ligar o LED
        res.status(200).json({ message: 'Comando enviado para ligar o LED' })
    } else if (dados.status === 'off') {
        port.write('0') // Enviar comando para desligar o LED
        res.status(200).json({ message: 'Comando enviado para desligar o LED' })
    } else {
        res.status(400).json({ message: 'Comando inválido' })
    }
})
