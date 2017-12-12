'use strict';

/**
 * Adapters
 *
 * @type {USB}
 */
exports.USB = require('./adapters/usb');
exports.Serial = require('./adapters/serial');
exports.Network = require('./adapters/network');
exports.Console = require('./adapters/console');

/**
 * Printer Support
 *
 * @type {Image}
 */
exports.Image = require('./image');
exports.Printer = require('./printer');
exports.Adapter = require('./adapter');
exports.command = require('./commands/commandsCustom');
exports.Printer2 = require('./utils/promiseify');