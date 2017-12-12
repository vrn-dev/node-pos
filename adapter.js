'use strict';
const util = require('util');
const EventEmitter = require('events');

/**
 * Adapter
 *
 * @returns {Adapter}
 * @constructor
 */
function Adapter() {
    EventEmitter.call(this);
    return this;
}

util.inherits(Adapter, EventEmitter);

Adapter.extends = function (ctor) {
    util.inherits(ctor, Adapter);
    return ctor;
};

Adapter.prototype.open = function () {
    throw new Error('Not Implemented Exception');
};

Adapter.prototype.close = function () {
    throw new Error('Not Implemented Exception');
};

Adapter.prototype.write = function () {
    throw new Error('Not Implemented Exception');
};

module.exports = Adapter;