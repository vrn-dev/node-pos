'use strict';
const util = require('util');
const qr = require('qr-image');
const iconv = require('iconv-lite');
const getPixels = require('get-pixels');
const Buffer = require('mutable-buffer');
const EventEmitter = require('events');
const Image = require('./image');
const utils = require('./utils/utils');
const _ = require('./commands/commandsCustom');
const Promiseify = require('./utils/promiseify');

/**
 * ESC/POS Printer
 *
 * @param adapter [usb, network or serial]
 * @returns {Printer} [escpos printer instance]
 * @constructor
 */
function Printer(adapter) {
    if ( !(this instanceof Printer) )
        return new Printer(adapter);

    let self = this;
    EventEmitter.call(this);
    this.adapter = adapter;
    this.buffer = new Buffer();
    this.encoding = 'GB18030';
    this._model = null;
}

Printer.create = function (device) {
    const printer = new Printer(device);
    return Promise.resolve(Promiseify(printer));
};

util.inherits(Printer, EventEmitter);


/**
 * Set printer model to recognize model-sepcific commands.
 * Supported models: [ null, 'qsprinter' ]
 *
 * For generic printers, set model to null
 *
 * Function Set Printer Model
 *
 * @param {string} _model
 * @returns {*}
 */
Printer.prototype.model = function (_model) {
    this._model = model;
    return this;
};

/**
 * Fix Left Margin
 *
 * @param {number} size
 * @returns {Printer}
 */
Printer.prototype.marginLeft = function (size) {
    this.buffer.write(_.MARGINS.LEFT);
    this.buffer.writeUInt8(size);
    return this;
};

/**
 * Print Content
 *
 * @param {string} content
 * @returns {Printer}
 */
Printer.prototype.print = function (content) {
    this.buffer.write(content);
    return this;
};

Printer.prototype.println = function (content) {
    return this.print(content + this.lineFeed());
};

/**
 * Line Feed
 *
 * @returns {Printer}
 */
Printer.prototype.lineFeed = function () {
    this.buffer.write(_.LF);
    return this.flush();
};

/**
 * Print encoded alpha-numeric text with EOL
 *
 * @param {string} content
 * @param {string} encoding
 * @returns {Printer}
 */
Printer.prototype.text = function (content, encoding) {
    return this.print(iconv.encode(content + _.LF, encoding || this.encoding));
};

/**
 * Print encoded alpha-numeric text without EOL
 *
 * @param {string} content
 * @param {string} encoding
 * @returns {Printer}
 */
Printer.prototype.pureText = function (content, encoding) {
    return this.print(iconv.encode(content, encoding || this.encoding));
};

/**
 * Set text encoding
 *
 * @param {string} encoding
 * @returns {Printer}
 */
Printer.prototype.encode = function (encoding) {
    this.encoding = encoding;
    return this;
};

/**
 * Feed Control Sequences
 *
 * [LF, CR, HT]
 *
 * @param {string} ctrl
 * @returns {Printer}
 */
Printer.prototype.control = function (ctrl) {
    this.buffer.write(_.FEED_CONTROL_SEQUENCES[
    'CTL_' + ctrl.toUpperCase()
        ]);
    return this;
};

/**
 * Text alignment
 *
 * [LT, CT, RT]
 *
 * @param {string} align
 * @returns {Printer}
 */
Printer.prototype.align = function (align) {
    this.buffer.write(_.TEXT_FORMAT[
    'TXT_ALIGN_' + align.toUpperCase()
        ]);
    return this;
};

/**
 * Set font
 * [A, B]
 *
 * @param {string} family
 * @returns {Printer}
 */
Printer.prototype.font = function (family) {
    this.buffer.write(_.TEXT_FORMAT[
    'TXT_FONT_' + family.toUpperCase()
        ]);
    return this;
};

/**
 * Set Font Style
 * [B, I, U, U2, BI, BIU, BIU2, BU, BU2, IU, IU2, NORMAL]
 *
 * @param {string} style
 * @returns {Printer}
 */
Printer.prototype.style = function (style) {
    switch ( type.toUpperCase() ) {
        case 'B':
            this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_ON);
            this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_OFF);
            this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL_OFF);
            break;
        case 'I':
            this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_OFF);
            this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_ON);
            this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL_OFF);
            break;
        case 'U':
            this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_OFF);
            this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_OFF);
            this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL_ON);
            break;
        case 'U2':
            this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_OFF);
            this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_OFF);
            this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL2_ON);
            break;
        case 'BI':
            this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_ON);
            this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_ON);
            this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL_OFF);
            break;
        case 'BIU':
            this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_ON);
            this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_ON);
            this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL_ON);
            break;
        case 'BIU2':
            this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_ON);
            this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_ON);
            this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL2_ON);
            break;
        case 'BU':
            this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_ON);
            this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_OFF);
            this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL_ON);
            break;
        case 'BU2':
            this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_ON);
            this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_OFF);
            this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL2_ON);
            break;
        case 'IU':
            this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_OFF);
            this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_ON);
            this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL_ON);
            break;
        case 'IU2':
            this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_OFF);
            this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_ON);
            this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL2_ON);
            break;

        case 'NORMAL':
        default:
            this.buffer.write(_.TEXT_FORMAT.TXT_BOLD_OFF);
            this.buffer.write(_.TEXT_FORMAT.TXT_ITALIC_OFF);
            this.buffer.write(_.TEXT_FORMAT.TXT_UNDERL_OFF);
            break;
    }
    return this;
};

Printer.prototype.size = function (width, height) {
    if ( 2 > +width && 2 >= height )
        this.buffer.write(_.TEXT_FORMAT.TXT_NORMAL);
    else if ( 2 === width && 2 === height ) {
        this.buffer.write(_.TEXT_FORMAT.TXT_2HEIGHT);
        this.buffer.write(_.TEXT_FORMAT.TXT_2WIDTH);
    }
    return this;
};

/**
 * Set line Spacing
 *
 * @param {number} n
 * @returns {Printer}
 */
Printer.prototype.lineSpace = function (n) {
    if ( n === undefined || n === null )
        this.buffer.write(_.LINE_SPACING.LS_DEFAULT);
    else if ( n === '1/8' ) {
        this.buffer.write(_.LINE_SPACING.LS_1_8);
        this.buffer.writeUInt8(n);
    }
    return this;
};

/**
 * Re Initialize Printer
 */
Printer.prototype.init = function () {
    this.buffer.write(_.HARDWARE.HW_INIT);
    return this.flush();
};

/**
 * Barcode Print Function
 *
 * @param {string} code
 * @param {string} type
 * @param {number} width
 * @param {number} height
 * @param {number} position
 * @param {string} font
 * @returns {Printer}
 */
Printer.prototype.barcode = function (code, type, width = 0, height = 0, position = 0, font = 0) {
    type = type || 'CODE39';
    let convertCode = String(code), parityBit = '', codeLength = '';
    // if (typeof  type === undefined || type === null)
    //     throw new TypeError('Barcode type is required');

    // TODO implement all barcodes

    this.buffer.write(_.BARCODE_FORMAT.BARCODE_TXT_BLW); // Set HRI
    this.buffer.write(_.BARCODE_FORMAT.BARCODE_WIDTH_DEFAULT); // Set Width
    this.buffer.write(_.BARCODE_FORMAT.BARCODE_HEIGHT_DEFAULT); // Set Height
    codeLength = utils.codeLength(code);
    this.buffer.write(codeLength + code);
    return this;
};

/**
 * Full Cut Paper
 */
Printer.prototype.cut = function () {
    this.buffer.write(_.PAPER.PAPER_FULL_CUT);
    return this.flush();
};

Printer.prototype.close = function (callback) {
    let self = this;
    return this.flush(() => {
        self.adapter.close(callback);
    });
};

module.exports = Printer;