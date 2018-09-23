/**
 * rpi-recycling-led
 * Created by PhpStorm.
 * File: Schedule.js.js
 * User: con
 * Date: 23.09.18
 * Time: 18:48
 */

const _ = require('lodash')

class Schedule {

  constructor (eventDates) {
    this.eventDates = eventDates
    this.today      = new Date()

    this.glowList  = []
    this.blinkList = []
  }

  lightUp () {

    // detect events for tomorrow
    _.forEach(this.eventDates, (eventDate, idx) => {

    })

    // detect events for today
    _.forEach(this.eventDates, (eventDate, idx) => {

    })

  }

}

module.exports = Schedule