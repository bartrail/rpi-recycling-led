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
var Table        = require('easy-table')

class Schedule {

  /**
   *
   * @param {DateTime} startDate
   * @param {EventDate[]} eventDates
   * @param {Object} options
   */
  constructor (startDate, eventDates, options) {
    /**
     * @type {EventDate[]}
     */
    this.eventDates = []
    _.forEach(eventDates, (eventDate, idx) => {
      if (eventDate.initialized) {
        this.eventDates.push(eventDate)
      }
    })

    this.options       = options
    this.demoDateIndex = 0
    this.demoDateList  = []

    if (this.options.simulate) {

      const firstDate = this.eventDates[0].startDate.minus({days: 2})
      const lastDate  = this.eventDates[this.eventDates.length - 1].startDate

      let currentDate = firstDate
      while (currentDate <= lastDate) {
        this.demoDateList.push(currentDate)
        currentDate = currentDate.plus({days: 1})
      }

      console.log('Simulating [%s] days from [%s] to [%s]', this.demoDateList.length, firstDate.toISODate(), lastDate.toISODate())
      console.log(' ')

      this.init(firstDate)

      this.dateUpdateIntervalId = setInterval(() => {
        this.demoDateIndex++
        this.updateDate(this.demoDateList[this.demoDateIndex])
      }, 10000)

    } else {
      this.init(startDate)

      this.dateUpdateIntervalId = setInterval(() => {
        let now = DateTime.local();
        if (false === now.hasSame(this.todayDate, 'day')) {
          this.updateDate(now)
        }
      }, 60000)
    }

  }

  /**
   * @param {DateTime} startDate
   */
  init (startDate) {
    if (false === startDate instanceof DateTime) {
      console.log('Invalid Date given: [%o]', startDate)
      return
    }
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
      this.stop()
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

  updateDate (todayDate) {
    this.lightOffTodayList()
    this.lightOffTomorrowList()
    this.init(todayDate)
    this.run()
  }

  run () {
    this.isRunning = true

    console.log(this.toString())

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
    console.log('stopping all intervals & timeouts');
    this.isRunning = false

    clearTimeout(this.today.timeoutId)
    clearTimeout(this.tomorrow.timeoutId)
    clearInterval(this.today.intervalId)
    clearInterval(this.tomorrow.intervalId)
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

  toString () {
    // let today    = '{y}-{m}-{d}'.parse({
    //   y: this.todayDate.year,
    //   m: this.todayDate.month,
    //   d: this.todayDate.day
    // })
    // let tomorrow = '{y}-{m}-{d}'.parse({
    //   y: this.tomorrowDate.year,
    //   m: this.tomorrowDate.month,
    //   d: this.tomorrowDate.day
    // })

    let today    = this.todayDate.toFormat('yyyy-LL-dd')
    let tomorrow = this.tomorrowDate.toFormat('yyyy-LL-dd')

    let todayOutput    = []
    let tomorrowOutput = []
    if (this.todayList.length > 0) {
      _.forEach(this.todayList, (eventDate) => {
        todayOutput.push({today: 'Color: [{c}] // GPIO [{g}]'.parse({c: eventDate.led.color, g: eventDate.led.gpio})})
      })
    } else {
      todayOutput.push({today: 'empty'})
    }

    if (this.tomorrowList.length > 0) {
      _.forEach(this.tomorrowList, (eventDate) => {
        tomorrowOutput.push({
          tomorrow: 'Color: [{c}] // GPIO [{g}]'.parse({
            c: eventDate.led.color,
            g: eventDate.led.gpio
          })
        })
      })
    } else {
      tomorrowOutput.push({tomorrow: 'empty'})
    }
    let mergedOutput = _.merge(todayOutput, tomorrowOutput)

    var t = new Table()
    _.forEach(mergedOutput, (output) => {
      t.cell("\nToday [{d}]".parse({d: today}), output.today)
      t.cell('Tomorrow [{d}]'.parse({d: tomorrow}), output.tomorrow)
      t.newRow()
    })

    return t.toString()
  }
}

module.exports = Schedule