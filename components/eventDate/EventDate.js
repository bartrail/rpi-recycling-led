/**
 * rpi-recycling-led
 * Created by PhpStorm.
 * File: eventDate.js
 * User: con
 * Date: 23.09.18
 * Time: 16:50
 */

const _          = require('lodash')
const {DateTime} = require('luxon')
const parse      = require('./../../util/string.parse.js')
const config     = require('config')

let leds = config.get('leds')

class EventDate {

  /**
   *
   * @param {ICAL.Event} iCalEvent
   */
  constructor (iCalEvent) {
    /**
     * @type {String}
     */
    this.uid = iCalEvent.uid
    /**
     * @type {String}
     */
    this.summary = iCalEvent.summary
    let jsDate = iCalEvent.startDate.toJSDate()
    let iso    = jsDate.toISOString()
    /**
     * @type {DateTime}
     */
    this.startDate = DateTime.fromISO(iCalEvent.startDate.toJSDate().toISOString())
    /**
     * @type {DateTime}
     */
    this.endDate = DateTime.fromISO(iCalEvent.endDate.toJSDate().toISOString())
    /**
     * @type {String}
     */
    this.organizer = iCalEvent.organizer
    /**
     * @type {String}
     */
    this.location = iCalEvent.location
    /**
     * @type {String}
     */
    this.description = iCalEvent.description
    /**
     * @type {Object}
     */
    this.led = {}

    _.forEach(leds, (led, idx) => {
      if (led.summary === this.summary) {
        this.led = led
      }
    })

    this.initialized = _.isEmpty(this.led)
  }

  toString () {
    return 'Summary: {summary}\nDates: [{startDate}] - [{endDate}]\nLocation: {location}\nDescription: {description}\n'.parse({
      summary    : this.summary,
      startDate  : this.startDate,
      endDate    : this.endDate,
      location   : this.location,
      description: this.description
    })

  }

}

module.exports = EventDate