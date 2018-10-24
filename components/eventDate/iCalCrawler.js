/**
 * rpi-recycling-led
 * Created by PhpStorm.
 * File: crawler.js
 * User: con
 * Date: 23.09.18
 * Time: 16:56
 */

var _            = require('lodash')
const rp         = require('request-promise')
const {DateTime} = require('luxon')
const ICAL       = require('ical.js')

const EventDate = require('./EventDate.js')

class iCalCrawler {

  constructor (uri) {
    this.uri        = uri
    this.rawContent = ''
  }

  fetch () {

    console.log('[%s] Fetching Events from', DateTime.local().toLocaleString(DateTime.DATETIME_SHORT))
    console.log(this.uri)
    console.log(' ')

    return new Promise((resolve, reject) => {
      rp({
        uri                    : this.uri,
        resolveWithFullResponse: true
      }).then((response) => {

        if (response.statusCode >= 200 && response.statusCode <= 300) {
          this.rawContent = response.body
          let eventDates  = this.parse()
          resolve(eventDates)
        } else {
          reject(response)
        }

      }).catch((error) => {
        console.error('ERROR: Unable to fetch from Server')
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
      console.error('ERROR: Unable to parse iCAL Data')
      console.error(e)
    }
  }

}

module.exports = iCalCrawler