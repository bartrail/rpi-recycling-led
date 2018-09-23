/**
 * rpi-recycling-led
 * Created by PhpStorm.
 * File: index.js
 * User: con
 * Date: 23.09.18
 * Time: 16:10
 */

const config = require('config')

const iCalCrawler = require('./components/eventDate/iCalCrawler.js');


let url  = config.get('iCalURL')
let leds = config.get('leds')

let crawler = new iCalCrawler(url);

crawler.fetch().then((icalData) => {
  // console.log(icalData)
});


