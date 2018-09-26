/**
 * rpi-recycling-led
 * Created by PhpStorm.
 * File: Schedule.js.js
 * User: con
 * Date: 23.09.18
 * Time: 18:48
 */

const Gpio = require('onoff').Gpio;

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

    this.lightUp();
  }

  lightUp () {


    const useLed = function (led, value) {
      led.writeSync(value);
    }

    let led;

    if (Gpio.accessible) {
      led = new Gpio(21, 'out');
    } else {
      led = {
        writeSync: function (value) {
          console.log('virtual led now uses value: ' + value);
        }
      };
    }

    useLed(led, 1);

  }

}

module.exports = Schedule