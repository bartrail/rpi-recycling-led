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

    this.todayDate    = startDate
    this.tomorrowDate = this.todayDate.plus({days: 1})

    /**
     * @type {EventDate[]}
     */
    this.todayList = []

    /**
     * @type {EventDate[]}
     */
    this.tomorrowList = []

    this.isRunning = false

    this.today = {
      intervalId: null,
      timeoutId : null
    }

    this.tomorrow = {
      intervalId: null
    }

    this.groupEventDates()
  }

  run () {
    this.isRunning = true

    this.today.intervalId = setInterval(() => {
      this.lightOffTodayList()
      this.today.timeoutId = setTimeout(() => {
        this.lightUpTodayList()
      }, 250)
    }, 500)
  }

  stop () {
    this.isRunning = false

    clearInterval(this.today.intervalId)
    clearTimeout(this.today.timeoutId)
  }

  groupEventDates () {

    // detect events for today
    _.forEach(this.eventDates, (eventDate, idx) => {
      if (eventDate.startDate.hasSame(this.todayDate, 'day')) {
        this.todayList.push(eventDate)
      }
    })

    // detect events for tomorrow
    _.forEach(this.eventDates, (eventDate, idx) => {
      if (eventDate.startDate.hasSame(this.tomorrowDate, 'day')) {
        this.tomorrowList.push(eventDate)
      }
    })

  }

  lightOffTodayList () {
    _.forEach(this.todayList, (eventDate, idx) => {
      eventDate.useLed(0)
    })
  }

  lightUpTodayList () {
    if (false === this.isRunning) {
      return
    }
    _.forEach(this.todayList, (eventDate, idx) => {
      eventDate.useLed(1)
    })
  }

  lightOffTomorrow () {
    _.forEach(this.tomorrowList, (eventDate, idx) => {
      eventDate.useLed(0)
    })
  }

  lightUpTomorrow () {
    if (false === this.isRunning) {
      return
    }
    _.forEach(this.tomorrowList, (eventDate, idx) => {
      eventDate.useLed(1)
    })
  }

  unexportOnClose () {
    _.forEach(this.eventDates, (eventDate, idx) => {
      eventDate.unexport()
    })
  }

}

module.exports = Schedule