'use strict';
const pos = require('../');

const device = new pos.USB();
const printer = new pos.Printer(device);

function padWithZero(val) {
    return (val < 10) ? ("0" + val) : val;
}

function getDate() {
    let date = new Date();
    let day = padWithZero(date.getDate());
    let month = padWithZero(date.getMonth() + 1);
    let year = date.getFullYear();
    return day + '-' + month + '-' + year;
}

let date = getDate();

function getTime() {
    let time = new Date();
    let hour = padWithZero(time.getHours());
    let min = padWithZero(time.getMinutes());
    let sec = padWithZero(time.getSeconds());
    return hour + ':' + min + ':' + sec;
}

let time = getTime();

device.open((err) => {
    printer
        .init()
        .font('A')
        .align('CT')
        .style('BU')
        .size(2, 2)
        .println('RoninTech Parking')
        .style('NORMAL')
        .size(1, 1)
        .barcode('2121217114234', 'CODE39')
        .lineFeed()
        .lineFeed()
        .println(date)
        .println(time)
        .lineFeed()
        .lineFeed()
        .println('1 Hours AED 10')
        .println('First 15 Minutes Free')
        .println('Lost Ticket Charge AED 150')
        .style('I')
        .println('Thank You');
    console.log(printer.buffer.MutableBuffer._buffer);

    printer
        .cut()
        .cut()
        .close()
});
