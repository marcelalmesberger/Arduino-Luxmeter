// LUXMETER by Marcel Almesberger dh181812

// defining light sensor
int lightSensor = A0;

// defining sensor value
int sensorValue = 0.00;

// defining total voltage
float totalVoltage = 5.00;

// defining sensor voltage
float sensorVoltage = 0.00;

// defining resistor voltage
float resistorVoltage = 0.00;

// defining sensor resistance
float sensorResistance = 0.00;

// defining resistor resistance (calculated with Alex Benz formula)
float resistorResistance = 6300.00;

// defining lux of sensor
float sensorLux = 0.00;

// defining lux converting constants
float LUX_CALC_SCALAR = 12518931.00;
float LUX_CALC_EXPONENT = -1.41;

// defining threshold when measurred lux are over 200
int threshold = 200;

// defining time intervall for measuring lux 
long previousMillis = millis();
long intervall = 1000; // sensor measures every second (1000 ms)

void setup() {
  //starting Serial Port
  Serial.begin(9600);

  //initializing built-in LED
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  // defining timer
  unsigned long currentMillis = millis();

  // checking if time intervall was reached
  if (currentMillis - previousMillis > intervall) {
    
    // reading light sensor
    sensorValue = analogRead(lightSensor);

    // converting sensor values to voltage of the sensor
    sensorVoltage = (5.00 / 1023.00) * (float) sensorValue;

    // calculating resistor voltage
    resistorVoltage = totalVoltage - sensorVoltage;

    // calculating sensor resistance
    sensorResistance = (sensorVoltage / resistorVoltage) * resistorResistance;

    // calculating lux of sensor
    sensorLux = LUX_CALC_SCALAR * pow(sensorResistance, LUX_CALC_EXPONENT);

    // turning built-in LED on & off depending on lux
    if (sensorLux > threshold) {
      digitalWrite(LED_BUILTIN, HIGH); // turns LED on when lux greater than 200
    }
    else {
      digitalWrite(LED_BUILTIN, LOW); // turns LED off
    }
    //defining timestamp
    long timestamp = millis();

    // forming JSON String
    String jsonString = "{\"sensorId\": ";
    jsonString += 0;
    jsonString += ",\"timestamp\": ";
    jsonString += timestamp;
    jsonString += ",\"type\": \"";
    jsonString += "photoresistor";
    jsonString += "\",\"unit\": \"";
    jsonString += "lux";
    jsonString += "\",\"value\": ";
    jsonString += sensorLux;
    jsonString +="}";
    
    // print JSON String
    Serial.println(jsonString);

    // set timer back
    previousMillis = currentMillis;
  }
}
