require('./text-polyfill');

const noble = require('noble');
const bleat = require('bleat').webbluetooth;
const { MUSE_SERVICE, MuseClient, zipSamples, channelNames,  MuseControlResponse, EEGSample } = require('muse-js');

async function connect() {
    console.log('Connecting...')
    let device = await bleat.requestDevice({
        filters: [{ services: [MUSE_SERVICE] }]
    });

    const gatt = await device.gatt.connect();
    console.log('Connected to Device name:', gatt.device.name);

    const client = new MuseClient();
    await client.connect(gatt);
    client.controlResponses.subscribe(x => console.log('Response:', x));
    await client.start();
    console.log('Client Started!');

    const keepaliveTimer = setInterval(() => client.sendCommand(''), 3000);

    client.eegReadings.subscribe(reading => {
      console.log(reading);
    });
    client.telemetryData.subscribe(telemetry => {
      console.log(telemetry);
    });
    client.accelerometerData.subscribe(acceleration => {
      console.log(acceleration);
    });
}

noble.on('stateChange', (state) => {
    if (state === 'poweredOn') {
        connect();
    }
});
