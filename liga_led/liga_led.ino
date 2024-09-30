int LED = 12;  // pino do LED 
void setup() {
  pinMode(LED, OUTPUT); // Definir o pino do LED como saída
  Serial.begin(9600); // Inicializar a comunicação serial
}

void loop() {
  if (Serial.available() > 0) {
    char comando = Serial.read(); // Ler o comando enviado via serial

    if (comando == '1') {
      digitalWrite(LED, HIGH); // Ligar o LED
      Serial.println("LED_ON"); // Enviar confirmação de que o LED foi ligado
    } else if (comando == '0') {
      digitalWrite(LED, LOW); // Desligar o LED
      Serial.println("LED_OFF"); // Enviar confirmação de que o LED foi desligado
    }
  }
}
