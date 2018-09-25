/**
 * rpi-recycling-led
 * Created by PhpStorm.
 * File: Schedule.js.js
 * User: con
 * Date: 23.09.18
 * Time: 18:48
 */

const _          = require('lodash')
const {DateTime} = require('luxon')

class Schedule {

  /**
   *
   * @param {DateTime} startDate
   * @param {EventDate[]} eventDates
   */
  constructor (startDate, eventDates) {

    /**
     * @type {EventDate[]}
     */
    this.eventDates = []
    _.forEach(eventDates, (eventDate, idx) => {
      if (eventDate.initialized) {
        this.eventDates.push(eventDate)
      }
    })

    this.today    = startDate
    this.tomorrow = this.today.plus({days: 1})

    /**
     * @type {EventDate[]}
     */
    this.todayList = []

    /**
     * @type {EventDate[]}
     */
    this.tomorrowList = []

    this.groupEventDates();
  }

  groupEventDates() {

    // detect events for today
    _.forEach(this.eventDates, (eventDate, idx) => {
      if (eventDate.startDate.hasSame(this.today, 'day')) {
        this.todayList.push(eventDate)
      }
    })

    // detect events for tomorrow
    _.forEach(this.eventDates, (eventDate, idx) => {
      if (eventDate.startDate.hasSame(this.tomorrow, 'day')) {
        this.tomorrowList.push(eventDate)
      }
    })

  }

  lightUp () {

    

  }

}

module.exports = Schedule