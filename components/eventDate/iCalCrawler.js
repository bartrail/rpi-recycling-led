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

const EventDate = require('./EventDate.js')

class iCalCrawler {

  constructor (uri) {
    this.uri        = uri
    this.rawContent = ''
    this.iCalData   = {}
  }

  fetch () {
    return new Promise((resolve, reject) => {
      rp({
        uri: this.uri
      }).then((response) => {

        this.rawContent = response
        let eventDates  = this.parse()
        resolve(eventDates)

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