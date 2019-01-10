/**
 * rpi-recycling-led
 * Created by PhpStorm.
 * File: crawler.js
 * User: con
 * Date: 23.09.18
 * Time: 16:56
 */

var _      = require('lodash')
const rp   = require('request-promise')
const ICAL = require('ical.js')

const config = require('config')
let ledList  = config.get('leds')

const EventDate = require('./EventDate.js')

class iCalCrawler {

  constructor (uri, options) {
    this.uri        = uri
    this.rawContent = ''
    this.options    = options
  }

  fetch () {

    console.log('Fetching Events from')
    console.log(this.uri)
    console.log(' ')

    var time            = 0
    var fetchInterval   = 5000
    var fetchIntervalId = setInterval(() => {
      time++
      if (this.options.verbose) {
        console.log('waiting %o seconds...', (time * fetchInterval / 1000))
      }
    }, fetchInterval)

    if (config.showLoading) {
      let i           = 0
      const blinkNext = function () {
        if (_.isNull(fetchIntervalId)) {
          return
        }
        let led = ledList[i]
        led.blink().then(() => {
          i++
          i = i % ledList.length
          blinkNext()
        })
      }
      blinkNext()
    }

    return new Promise((resolve, reject) => {
      rp({
        uri                    : this.uri,
        resolveWithFullResponse: true
      }).then((response) => {
        clearInterval(fetchIntervalId);
        fetchIntervalId = null;
        if (response.statusCode >= 200 && response.statusCode <= 300) {
          this.rawContent = response.body
          let eventDates  = this.parse()
          resolve(eventDates)
        } else {
          reject(response)
        }

      }).catch((error) => {
        clearInterval(fetchIntervalId)
        fetchIntervalId = null;
        console.log('ERROR: Unable to fetch from Server')
        reject(error)
      })
    })

  }

  parse () {
    try {
      this.iCalData  = ICAL.parse(this.rawContent)
      var comp       = new ICAL.Component(this.iCalData)
      let eventDates = []

      _.forEach(comp.getAllSubcomponents(), (vevent, idx) => {
        let event = new ICAL.Event(vevent)
        eventDates.push(new EventDate(event))
      })

      return eventDates

    } catch (e) {
      console.log('ERROR: Unable to parse iCAL Data')
      console.log(e)
    }
  }

}

module.exports = iCalCrawler
