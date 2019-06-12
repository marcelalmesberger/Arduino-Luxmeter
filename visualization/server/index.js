// load express module and create express application
const express = require("express");
const app = express();

// load serialport module function
const serialport = require("serialport");
const Readline = require("@serialport/parser-readline");

// load file-system module
const fs = require("fs");

// create variable for future path of JSON file
const fileName = __dirname + "/file.json";

// create JSON file
fs.writeFileSync(fileName, "", "utf8", (err) => {
    if (err) {
        console.log(err);
    }
});

// create data object for future sensor data
const dataArray = [];

// save Arduino manufacturer in variable
const manufacturerName = "Arduino LLC (www.arduino.cc)";

// reading data from Arduino
serialport.list((err, result) => {
    
    // searching Arduino and save it in variable
    const device = result.find((device) => device.manufacturer === manufacturerName);

    // log Arduino connection
    if (device) {
        console.log("Found Arduino", device);

        // save serialport in variable
        const arduinoPort = new serialport(device.comName, {baudRate: 9600});

        // port open
        arduinoPort.on("open", () => {
            console.log("Port to Arduino opened");
        });
        
        // port closed
        arduinoPort.on("close", () => {
            console.log("Port to Arduino closed");
        });

        // port error
        arduinoPort.on("error", (error) => {
            console.log("Error from Arduino: ", error);
        });

        // save parser in variable
        const parser = arduinoPort.pipe(new Readline({ delimiter: "\n"}));
        
        // parse data and append to JSON file
        parser.on("data", data => {
            try {
                
                const parsedValue = JSON.parse(data);
                dataArray.push(parsedValue);

                const lastData = dataArray[dataArray.length - 1];

                const results = JSON.stringify(lastData);

                fs.appendFileSync(fileName, results + "," + "\n", "utf8", (err) => {
                    if (err) {
                        console.log(err);
                    }
                });

                if (dataArray.length > 100) {
                    process.exit();
                }
            }
            catch (error) {
                console.log("Could not read line skip it...");
            }
        });
    }
    else {
        console.log('No Arduino found!');
    }
});

// server listining on port 3000
app.listen(3000, () => {
    console.log("Server listening on port 3000!");
});