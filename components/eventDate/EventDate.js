/**
 * rpi-recycling-led
 * Created by PhpStorm.
 * File: eventDate.js
 * User: con
 * Date: 23.09.18
 * Time: 16:50
 */

const parse = require('./../../util/string.parse.js')

class EventDate {

  /**
   *
   * @param {ICAL.Event} iCalEvent
   */
  constructor (iCalEvent) {
    this.uid         = iCalEvent.uid
    this.summary     = iCalEvent.summary
    this.startDate   = iCalEvent.startDate
    this.endDate     = iCalEvent.endDate
    this.organizer   = iCalEvent.organizer
    this.location    = iCalEvent.location
    this.description = iCalEvent.description
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