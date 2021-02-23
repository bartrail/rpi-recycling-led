/**
 * rpi-recycling-led
 * Created by PhpStorm.
 * File: console.js.js
 * User: con
 * Date: 2019-01-05
 * Time: 11:33
 */

const {DateTime} = require('luxon')

// Save the original method in a private variable
var _privateLog = console.log
// Redefine console.log method with a custom function
console.log     = function (message) {
  message = '[' + DateTime.local().toFormat('yyyy-LL-dd HH:mm:ss') + '] ' + message
  // _privateLog(message, arguments);
  _privateLog.apply(console, arguments)
}