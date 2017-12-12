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
    printer.init();
    printer.font('A');
    printer.align('CT');
    printer.style('BU');
    printer.size(2, 2);
    printer.print('RoninTech Parking');
    printer.lineFeed();
    printer.style('NORMAL');
    printer.size(1, 1);
    printer.barcode('2121217114234', 'CODE39');
    printer.lineFeed();
    printer.lineFeed();
    printer.print(date);
    printer.lineFeed();
    printer.print(time);
    printer.lineFeed();
    printer.lineFeed();
    printer.print('1 Hours AED 10');
    printer.lineFeed();
    printer.print('1 Hours AED 10');
    printer.lineFeed();
    printer.print('First 15 Minutes Free');
    printer.lineFeed();
    printer.print('Lost Ticket Charge AED 150');
    printer.lineFeed();
    printer.style('I');
    printer.print('Thank You');
    printer.cut();
    printer.cut();
    printer.close();
    console.log(err)
});
