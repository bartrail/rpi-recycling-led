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
const config     = require('config')

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

    this.init(startDate)

    this.dateIndex = 0

    this.dateList = [
      {year: 2018, month: 10, day: 25},
      {year: 2018, month: 10, day: 26},
      {year: 2018, month: 10, day: 27},
      {year: 2018, month: 10, day: 28},
      {year: 2018, month: 10, day: 29},
      {year: 2018, month: 10, day: 30},
      {year: 2018, month: 10, day: 31},
      {year: 2018, month: 11, day: 1},
      {year: 2018, month: 11, day: 2},
      {year: 2018, month: 11, day: 3},
      {year: 2018, month: 11, day: 4},
      {year: 2018, month: 11, day: 5},
      {year: 2018, month: 11, day: 6},
      {year: 2018, month: 11, day: 7},
      {year: 2018, month: 11, day: 8},
      {year: 2018, month: 11, day: 9},
      {year: 2018, month: 11, day: 10},
      {year: 2018, month: 11, day: 11},
      {year: 2018, month: 11, day: 12},
      {year: 2018, month: 11, day: 13},
      {year: 2018, month: 11, day: 14},
      {year: 2018, month: 11, day: 15},
      {year: 2018, month: 11, day: 16},
      {year: 2018, month: 11, day: 17},
      {year: 2018, month: 11, day: 18},
      {year: 2018, month: 11, day: 19},
      {year: 2018, month: 11, day: 20},
      {year: 2018, month: 11, day: 21},
      {year: 2018, month: 11, day: 22},
      {year: 2018, month: 11, day: 23},
      {year: 2018, month: 11, day: 24},
      {year: 2018, month: 11, day: 25},
      {year: 2018, month: 11, day: 26},
      {year: 2018, month: 11, day: 27},
      {year: 2018, month: 11, day: 28},
      {year: 2018, month: 11, day: 29},
      {year: 2018, month: 11, day: 30},
      {year: 2018, month: 12, day: 1},
      {year: 2018, month: 12, day: 2},
      {year: 2018, month: 12, day: 3},
      {year: 2018, month: 12, day: 4},
      {year: 2018, month: 12, day: 5},
      {year: 2018, month: 12, day: 6},
      {year: 2018, month: 12, day: 7},
      {year: 2018, month: 12, day: 8},
      {year: 2018, month: 12, day: 9},
      {year: 2018, month: 12, day: 10},
      {year: 2018, month: 12, day: 11},
      {year: 2018, month: 12, day: 12},
      {year: 2018, month: 12, day: 13},
      {year: 2018, month: 12, day: 14},
      {year: 2018, month: 12, day: 15},
      {year: 2018, month: 12, day: 16},
      {year: 2018, month: 12, day: 17},
      {year: 2018, month: 12, day: 18},
      {year: 2018, month: 12, day: 19},
      {year: 2018, month: 12, day: 20},
      {year: 2018, month: 12, day: 21},
      {year: 2018, month: 12, day: 22},
      {year: 2018, month: 12, day: 23},
      {year: 2018, month: 12, day: 24},
      {year: 2018, month: 12, day: 25},
      {year: 2018, month: 12, day: 26},
      {year: 2018, month: 12, day: 27},
      {year: 2018, month: 12, day: 28},
      {year: 2018, month: 12, day: 29},
    ]

    this.dateUpdateIntervalId = setInterval(() => {
      this.updateDate()
      this.dateIndex++
    }, 10000)
  }

  init (startDate) {
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

    try {
      clearInterval(this.today.intervalId)
      clearInterval(this.tomorrow.intervalId)
      clearTimeout(this.today.timeoutId)
      clearTimeout(this.tomorrow.timeoutId)
    } catch (e) {}

    this.today = {
      intervalId: null,
      timeoutId : null
    }

    this.tomorrow = {
      intervalId: null,
      timeoutId : null
    }

    this.groupEventDates()
  }

  updateDate () {
    this.lightOffTodayList()
    this.lightOffTomorrowList()
    this.init(
      DateTime.local(
        this.dateList[this.dateIndex].year,
        this.dateList[this.dateIndex].month,
        this.dateList[this.dateIndex].day
      )
    )
    console.log('%s.%s.%s', this.todayDate.year, this.todayDate.month, this.todayDate.day)
    this.run()

  }

  run () {
    this.isRunning = true

    let interval = config.get('interval')

    this.lightOnTodayList()
    this.today.intervalId = setInterval(() => {
      this.lightOffTodayList()
      this.today.timeoutId = setTimeout(() => {
        this.lightOnTodayList()
      }, interval.todayOff)
    }, interval.todayOn)

    this.lightOnTomorrowList()
    this.tomorrow.intervalId = setInterval(() => {
      this.lightOffTomorrowList()
      this.tomorrow.timeoutId = setTimeout(() => {
        this.lightOnTomorrowList()
      }, interval.tomorrowOff)
    }, interval.tomorrowOn)
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

  lightOnTodayList () {
    if (false === this.isRunning) {
      return
    }
    _.forEach(this.todayList, (eventDate, idx) => {
      eventDate.useLed(1)
    })
  }

  lightOffTomorrowList () {
    if (false === this.isRunning) {
      return
    }

    _.forEach(this.tomorrowList, (eventDate, idx) => {
      eventDate.useLed(0)
    })
  }

  lightOnTomorrowList () {
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