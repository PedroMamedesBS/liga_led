// Conectar ao servidor Socket.IO
const socket = io('http://localhost:3000')

// Referências para os botões e a div de status do LED
const ligarBtn = document.getElementById('ligarBtn')
const desligarBtn = document.getElementById('desligarBtn')
const statusLed = document.getElementById('statusLed')

// Função para controlar o LED (envia o status para o backend)
function controlarLed(status) {
    fetch('http://localhost:3000/led', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: status }), // 'on' ou 'off' que vem do click do botão
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message) // Exibe a resposta no console
    })
    .catch(error => {
        console.error('Erro:', error)
    })
}

// Adiciona os eventos de clique nos botões
ligarBtn.addEventListener('click', () => {
    controlarLed('on') // Envia o comando para ligar o LED
})

desligarBtn.addEventListener('click', () => {
    controlarLed('off') // Envia o comando para desligar o LED
})

// Ouvir o evento de confirmação do backend (via Socket.IO)
socket.on('confirmacaoLed', (mensagem) => {
    console.log(mensagem)
    
    if (mensagem === 'LED ligado') {
        statusLed.textContent = "LED: Ligado" // Atualiza o texto
        statusLed.style.backgroundColor = "green" // Muda a cor de fundo para verde
    } else if (mensagem === 'LED desligado') {
        statusLed.textContent = "LED: Desligado" // Atualiza o texto
        statusLed.style.backgroundColor = "red" // Muda a cor de fundo para vermelho
    } else {
        statusLed.textContent = "LED Status: Desconhecido"
        statusLed.style.backgroundColor = "gray" // Mantém a cor cinza se o status for desconhecido
    }
})
