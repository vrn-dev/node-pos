'use strict';
const net = require('net');
const util = require('util');
const EventEmitter = require('events');


/**
 * Network Adapter
 *
 * @param address
 * @param port
 * @returns {Network}
 * @constructor
 */

function Network(address, port) {
    EventEmitter.call(this);
    this.address = address;
    this.port = port;
    this.device = new net.Socket();
    return this;
}

util.inherits(Network, EventEmitter);


/**
 * Connect to remote device
 *
 * @param callback
 * @returns {*}
 */
Network.prototype.open = function (callback) {
    let self = this;
    //connect to net printer by socket(port, ip_
    this.device.on('error', (err) => {
        callback && callback(err, self.device);
    })
        .connect(this.port, this.address, (err) => {
            self.emit('connect', self.device);
            callback && callback(err, self.device);
        });
    return this;
};

/**
 * Write Data to Printer
 *
 * @param data
 * @param callback
 * @returns {*}
 */
Network.prototype.write = function (data, callback) {
    this.device.write(data, callback);
    return this;
};


/**
 * Disconnect from Device
 *
 * @param callback
 * @returns {*}
 */
Network.prototype.close = function (callback) {
    if ( this.device ) {
        this.device.destroy();
        this.device = null;
    }
    this.emit('disconnect', this.device);
    callback && callback(null, this.device);
    return this;
};

module.exports = Network;