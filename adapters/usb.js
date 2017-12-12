'use strict';
const os = require('os');
const usb = require('usb');
const util = require('util');
const EventEmitter = require('events');


/**
 * USB Class Codes
 *
 * @type {{AUDIO: number, HID: number, PRINTER: number, HUB: number}}
 */
const IFACE_CLASS = {
    AUDIO: 0x01,
    HID: 0x03,
    PRINTER: 0x07,
    HUB: 0x09
};

/**
 * USB Function
 *
 * @param vid
 * @param pid
 * @returns {USB}
 * @constructor
 */
function USB(vid, pid) {
    EventEmitter.call(this);
    let self = this;
    this.device = null;
    if ( vid && pid )
        this.device = usb.findByIds(vid, pid);
    else if ( vid )
        this.device = vid;
    else {
        let devices = USB.findPrinter();
        if ( devices && devices.length )
            this.device = devices[ 0 ];
    }

    if ( !this.device )
        throw new Error('Cannot find printer');

    usb.on('detach', (device) => {
        if ( device == self.device ) {
            self.emit('detach', device);
            self.emit('disconnect', device);
            self.device = null;
        }
    });
    return this;
}

/**
 * Find Printer
 *
 * @returns {Int32Array | * | Uint32Array | T[] | Int8Array | Float64Array}
 */
USB.findPrinter = function () {
    return usb.getDeviceList().filter((device) => {
        try {
            return device.configDescriptor.interfaces
                .filter((iface) => {
                    return iface.filter((conf) => {
                        return conf.bInterfaceClass === IFACE_CLASS.PRINTER;
                    }).length;
                }).length;
        } catch ( e ) {
            return false;
        }
    });
};


/**
 * Get Device
 *
 * @param vid
 * @param pid
 * @returns {Promise<any>}
 */
USB.getDevice = function (vid, pid) {
    return new Promise((resolve, reject) => {
        const device = new USB(vid, pid);
        device.open(err => {
            if ( err ) return reject(err);
            resolve(device);
        });
    });
};

/**
 * Make USB extend EventEmitter
 */
util.inherits(USB, EventEmitter);

/**
 * Open USB Device
 *
 * @param callback
 * @returns {*}
 */
USB.prototype.open = function (callback) {
    let self = this, counter = 0, index = 0;
    this.device.open();
    this.device.interfaces.forEach(function (iface) {
        (function (iface) {
            iface.setAltSetting(iface.altSetting, function () {
                // http://libusb.sourceforge.net/api-1.0/group__dev.html#gab14d11ed6eac7519bb94795659d2c971
                // libusb_kernel_driver_active / libusb_attach_kernel_driver / libusb_detach_kernel_driver : "This functionality is not available on Windows."
                if ( "win32" !== os.platform() ) {
                    if ( iface.isKernelDriverActive() ) {
                        try {
                            iface.detachKernelDriver();
                        } catch ( e ) {
                            console.error("[ERROR] Could not detatch kernel driver: %s", e)
                        }
                    }
                }
                iface.claim(); // must be called before using any endpoints of this interface.
                iface.endpoints.filter(function (endpoint) {
                    if ( endpoint.direction == 'out' && !self.endpoint ) {
                        self.endpoint = endpoint;
                    }
                });
                if ( self.endpoint ) {
                    self.emit('connect', self.device);
                    callback && callback(null, self);
                } else if ( ++counter === this.device.interfaces.length && !self.endpoint ) {
                    callback && callback(new Error('Can not find endpoint from printer'));
                }
            });
        })(iface);
    });
    return this;
};


/**
 * Write to USB Printer
 *
 * @param data
 * @param callback
 * @returns {*}
 */
USB.prototype.write = function (data, callback) {
    this.emit('data', data);
    this.endpoint.transfer(data, callback);
    return this;
};

/**
 * Close USB Connection
 *
 * @param callback
 * @returns {*}
 */
USB.prototype.close = function (callback) {
    if ( this.device ) {
        this.emit('close', this.device);
        this.device.close();
    }
    callback && callback();
    return this;
};

module.exports = USB;