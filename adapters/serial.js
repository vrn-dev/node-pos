'use strict';
const util = require('util');
const EventEmitter = require('events');
const SerialPort = require('serialport');


/**
 * Serial Port Device
 *
 * @param port
 * @param options
 * @returns {Serial}
 * @constructor
 */
function Serial(port, options) {
    let self = this;
    options = options || {
        baudRate: 9600,
        autoOpen: false
    };
    this.device = new SerialPort(port, options);
    this.device.on('close', () => {
        self.emit('disconnect', self.device);
        self.device = null;
    });
    EventEmitter.call(this);
    return this;
}

util.inherits(Serial, EventEmitter);


/**
 * Open Device
 *
 * @param callback
 * @returns {*}
 */
Serial.prototype.open = function (callback) {
    this.device.open(callback);
    return this;
};


/**
 * Write data to serial port device
 *
 * @param data
 * @param callback
 * @returns {*}
 */
Serial.prototype.write = function (data, callback) {
    this.device.write(data, callback);
    return this;
};

/**
 * Close Device
 *
 * @param callback
 * @returns {*}
 */
Serial.prototype.close = function (callback) {
    let self = this;
    this.device.drain((err) => {
        self.device.close();
        self.device = null;
        callback && callback(err, self.device);
    });
    return this;
};

module.exports = Serial;
