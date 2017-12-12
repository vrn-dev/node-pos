/**
 * ESC/POS _ (Constants)
 */
let _ = {
    LF: '\x0a',
    EOL: '\n'
};


/**
 * [FEED_CONTROL_SEQUENCES Feed control sequences]
 * @type {Object}
 */
_.FEED_CONTROL_SEQUENCES = {
    CTL_LF: '\x0a',   // Print and line feed
    CTL_CR: '\x0d',   // Carriage return
    CTL_HT: '\x09',   // Horizontal tab
};

_.LINE_SPACING = {
    LS_DEFAULT: '\x1b\x32', // 1/6-inch line spacing
    LS_1_8: '\x1b\x30'  // 1/8-inch line spacing
};

/**
 * [HARDWARE Printer hardware]
 * @type {Object}
 */
_.HARDWARE = {
    HW_INIT: '\x1b\x40', // Clear data in buffer and reset modes
    HW_SELECT: '\x1b\x3d\x01', // Printer select
};

/**
 * [CASH_DRAWER Cash Drawer]
 * @type {Object}
 */
_.CASH_DRAWER = {
    CD_KICK_2: '\x1b\x70\x00', // Sends a pulse to pin 2 []
    CD_KICK_5: '\x1b\x70\x01', // Sends a pulse to pin 5 []
};

/**
 * [MARGINS Margins sizes]
 * @type {Object}
 */
_.MARGINS = {
    LEFT: '\x1d\x4c', // Fix left size
};

/**
 * [PAPER Paper]
 * @type {Object}
 */
_.PAPER = {
    PAPER_FULL_CUT: '\x1b\x69', // Full cut paper
    PAPER_PART_CUT: '\x1b\x6d', // Partial cut paper
};

/**
 * [TEXT_FORMAT Text format]
 * @type {Object}
 */
_.TEXT_FORMAT = {

    TXT_NORMAL: '\x1d\x21\x00', // Normal text
    TXT_2HEIGHT: '\x1d\x21\x01', // Double height text
    TXT_2WIDTH: '\x1b\x21\x10', // Double width text

    /**
     * @return {string}
     */
    TXT_CUSTOM_SIZE: function (width, height) { // other sizes
        let widthDec = (width - 1) * 16;
        let heightDec = height - 1;
        let sizeDec = widthDec + heightDec;
        return '\x1d\x21' + String.fromCharCode(sizeDec);
    },

    TXT_HEIGHT: {
        1: '\x00',
        2: '\x01',
        3: '\x02',
        4: '\x03',
        5: '\x04',
        6: '\x05',
        7: '\x06',
        8: '\x07'
    },
    TXT_WIDTH: {
        1: '\x00',
        2: '\x10',
        3: '\x20',
        4: '\x30',
        5: '\x40',
        6: '\x50',
        7: '\x60',
        8: '\x70'
    },

    TXT_UNDERL_OFF: '\x1b\x2d\x00', // Underline font OFF
    TXT_UNDERL_ON: '\x1b\x2d\x01', // Underline font 1-dot ON
    TXT_UNDERL2_ON: '\x1b\x2d\x02', // Underline font 2-dot ON
    TXT_BOLD_OFF: '\x1b\x45\x00', // Bold font OFF
    TXT_BOLD_ON: '\x1b\x45\x01', // Bold font ON
    TXT_ITALIC_OFF: '\x1b\x34\x00', // Italic font OFF
    TXT_ITALIC_ON: '\x1b\x34\x01', // Italic font ON

    TXT_FONT_A: '\x1b\x21\x00', // Font type A
    TXT_FONT_B: '\x1b\x21\x01', // Font type B

    TXT_ALIGN_LT: '\x1b\x61\x00', // Left justification
    TXT_ALIGN_CT: '\x1b\x61\x01', // Centering
    TXT_ALIGN_RT: '\x1b\x61\x02', // Right justification
};

/**
 * Qsprinter-compatible
 * Added by Attawit Kittikrairit
 * [MODEL Model-specific commands]
 * @type {Object}
 */
_.MODEL = {
    QSPRINTER: {
        BARCODE_MODE: {
            ON: '\x1d\x45\x43\x01', // Barcode mode on
            OFF: '\x1d\x45\x43\x00', // Barcode mode off
        },
        BARCODE_HEIGHT_DEFAULT: '\x1d\x68\xA2', // Barcode height default:162
        CODE2D_FORMAT: {
            PIXEL_SIZE: {
                CMD: '\x1b\x23\x23\x51\x50\x49\x58',
                MIN: 1,
                MAX: 24,
                DEFAULT: 12,
            },
            VERSION: {
                CMD: '\x1d\x28\x6b\x03\x00\x31\x43',
                MIN: 1,
                MAX: 16,
                DEFAULT: 3,
            },
            LEVEL: {
                CMD: '\x1d\x28\x6b\x03\x00\x31\x45',
                OPTIONS: {
                    L: 48,
                    M: 49,
                    Q: 50,
                    H: 51,
                }
            },
            LEN_OFFSET: 3,
            SAVEBUF: {
                // Format: CMD_P1{LEN_2BYTE}CMD_P2{DATA}
                // DATA Max Length: 256*256 - 3 (65533)
                CMD_P1: '\x1d\x28\x6b',
                CMD_P2: '\x31\x50\x30',
            },
            PRINTBUF: {
                // Format: CMD_P1{LEN_2BYTE}CMD_P2
                CMD_P1: '\x1d\x28\x6b',
                CMD_P2: '\x31\x51\x30',
            }
        },
    },
};

/**
 * [BARCODE_FORMAT Barcode format]
 * @type {Object}
 */
_.BARCODE_FORMAT = {
    BARCODE_TXT_OFF: '\x1d\x48\x00', // HRI barcode chars OFF
    BARCODE_TXT_ABV: '\x1d\x48\x01', // HRI barcode chars above
    BARCODE_TXT_BLW: '\x1d\x48\x02', // HRI barcode chars below
    BARCODE_TXT_BTH: '\x1d\x48\x03', // HRI barcode chars both above and below
    BARCODE_TXT_FONT_A: '\x1d\x66\x00', // HRI Barcode font A
    BARCODE_TXT_FONT_B: '\x1d\x66\x01', //HRI Barcode Font B

    /**
     * @return {string}
     */
    BARCODE_HEIGHT: function (height) { // Barcode Height [1-255]
        return '\x1d\x68' + String.fromCharCode(height);
    },
    // Barcode Width  [2-6]
    BARCODE_WIDTH: {
        1: '\x1d\x77\x02',
        2: '\x1d\x77\x03',
        3: '\x1d\x77\x04',
        4: '\x1d\x77\x05',
        5: '\x1d\x77\x06',
    },
    BARCODE_HEIGHT_DEFAULT: '\x1d\x68\xa2', // Barcode height default:100
    BARCODE_WIDTH_DEFAULT: '\x1d\x77\x03', // Barcode width default:2

    BARCODE_UPC_A: '\x1d\x6b\x00', // Barcode type UPC-A
    BARCODE_UPC_E: '\x1d\x6b\x01', // Barcode type UPC-E
    BARCODE_EAN13: '\x1d\x6b\x02', // Barcode type EAN13
    BARCODE_EAN8: '\x1d\x6b\x03', // Barcode type EAN8
    BARCODE_CODE39: '\x1d\x6b\x69', // Barcode type CODE39
    BARCODE_ITF: '\x1d\x6b\x05', // Barcode type ITF
    BARCODE_CODEABAR: '\x1d\x6b\x06', // Barcode type NW7
    BARCODE_CODE93: '\x1d\x6b\x07', // Barcode type CODE93
    BARCODE_CODE128: '\x1d\x6b\x08', // Barcode type CODE128
    BARCODE_CODE32: '\x1d\x6b\x14', // Barcode type CODE32
};

/**
 * [CODE2D_FORMAT description]
 * @type {Object}
 */
_.CODE2D_FORMAT = {
    TYPE_PDF417: _.GS + 'Z' + '\x00',
    TYPE_DATAMATRIX: _.GS + 'Z' + '\x01',
    TYPE_QR: _.GS + 'Z' + '\x02',
    CODE2D: _.ESC + 'Z',
    QR_LEVEL_L: 'L', // correct level 7%
    QR_LEVEL_M: 'M', // correct level 15%
    QR_LEVEL_Q: 'Q', // correct level 25%
    QR_LEVEL_H: 'H'  // correct level 30%
};

/**
 * [IMAGE_FORMAT Image format]
 * @type {Object}
 */
_.IMAGE_FORMAT = {
    S_RASTER_N: '\x1d\x76\x30\x00', // Set raster image normal size
    S_RASTER_2W: '\x1d\x76\x30\x01', // Set raster image double width
    S_RASTER_2H: '\x1d\x76\x30\x02', // Set raster image double height
    S_RASTER_Q: '\x1d\x76\x30\x03', // Set raster image quadruple
};

/**
 * [BITMAP_FORMAT description]
 * @type {Object}
 */
_.BITMAP_FORMAT = {
    BITMAP_S8: '\x1b\x2a\x00',
    BITMAP_D8: '\x1b\x2a\x01',
    BITMAP_S24: '\x1b\x2a\x20',
    BITMAP_D24: '\x1b\x2a\x21'
};

/**
 * [GSV0_FORMAT description]
 * @type {Object}
 */
_.GSV0_FORMAT = {
    GSV0_NORMAL: '\x1d\x76\x30\x00',
    GSV0_DW: '\x1d\x76\x30\x01',
    GSV0_DH: '\x1d\x76\x30\x02',
    GSV0_DWDH: '\x1d\x76\x30\x03'
};


/**
 * [exports description]
 * @type {[type]}
 */
module.exports = _;