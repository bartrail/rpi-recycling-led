/**
 * rpi-recycling-led
 * Created by PhpStorm.
 * File: index.js
 * User: con
 * Date: 23.09.18
 * Time: 16:10
 */

const config = require('config')

let url  = config.get('iCalURL')
let leds = config.get('leds')



console.log(url)

