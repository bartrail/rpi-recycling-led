/**
 * rpi-recycling-led
 * Created by PhpStorm.
 * File: index.js
 * User: con
 * Date: 23.09.18
 * Time: 16:10
 */

const commandLineArgs  = require('command-line-args')
const commandLineUsage = require('command-line-usage')
const _                = require('lodash')
const config           = require('config')
const {DateTime}       = require('luxon')
const Gpio             = require('onoff').Gpio

const iCalCrawler = require('./components/eventDate/iCalCrawler.js')
const Schedule    = require('./components/eventDate/Schedule.js')

let url     = config.get('iCalURL')
let ledList = config.get('leds')

const sections = [
  {
    header : 'Raspberry PI Recycling LED',
    content: 'This little project is intends to read a iCAL Stream and highlight connected LEDs in their equivalent color according to the color of recycling bins.\n'
  },
  {
    header : 'URL',
    content: url
  },
  {
    header    : 'Options',
    optionList: [
      {
        name       : 'run',
        description: 'runs the app :)'
      },
      {
        name       : 'date',
        description: 'The default start date (typically "today"). Can be changed to any date with the format YYYY-MM-DD (ISO 8601) to simulate another day'
      },
      {
        name       : 'listEvents',
        description: 'Lists all events found in the given URL (for debugging purposes)'
      },
      {
        name       : 'testLeds',
        description: 'Test if all LEDs are working'
      },
      {
        name       : 'verbose',
        // typeLabel  : '{underline file}',
        description: 'Verbose output'
      },
      {
        name       : 'help',
        description: 'Print this usage guide.'
      }
    ]
  }
]

const usage = commandLineUsage(sections)

const optionDefinitions = [
  {name: 'run', type: Boolean, default: true},
  {name: 'listEvents', type: Boolean, default: false},
  {name: 'testLeds', type: Boolean, default: false},
  {name: 'date', type: String, defaultValue: DateTime.local().toFormat('y-LL-d')},
  {name: 'verbose', alias: 'v', type: Boolean},
  {name: 'help', alias: 'h', type: Boolean, default: false},
]

const options = commandLineArgs(optionDefinitions)

let startDate = DateTime.fromISO(options.date)

if (!startDate.isValid) {
  console.error('Invalid Date [%s]: %s', options.date, startDate.invalidReason)
  exitHandler({exit: true}, 1)
  return
}

for (let i = 0, ii = ledList.length; i < ii; i++) {

  if (options.verbose) {
    console.log('GPIO [%s] - Color: [%s] - Summary: [%s]', ledList[i].gpio, ledList[i].color, ledList[i].summary)
  }

  if (Gpio.accessible) {
    ledList[i].led = new Gpio(ledList[i].gpio, 'out')
    if (options.testLeds) {
      ledList[i].led.writeSync(1)
    }
  }

}

if (true !== options.testLeds) {

  var crawler = new iCalCrawler(url)
  var schedule

  crawler.fetch().then((eventDates) => {
    if (options.listEvents) {
      _.forEach(eventDates, (eventDate, idx) => {
        console.log(eventDate.toString())
      })

      // abort if we don't have the --run option
      if (options.run !== true) {
        exitHandler({exit: true}, 1)
        return
      }
    }

    if (options.run !== true) {
      console.log('Please start with --run to run it')
      console.log(usage)
      exitHandler({exit: true}, 1)
      return
    }

    schedule = new Schedule(startDate, eventDates)
    schedule.run()

  }).catch((error) => {

    console.error('Error fetching or parsing data')
    console.error(error)

  })
}

function exitHandler (options, exitCode) {
  if (options.cleanup) {
    console.log('clean up')
  }
  if (exitCode || exitCode === 0) {
    console.log('Exit Code: [%s]', exitCode)
  }
  if (options.exit) {
    if (_.isObject(schedule)) {
      schedule.isRunning = false
      schedule.unexportOnClose()
    } else {
      for (let i = 0, ii = ledList.length; i < ii; i++) {
        ledList[i].led.writeSync(0)
        ledList[i].led.unexport()
      }
    }
  }
}

process.stdin.resume()

//do something when app is closing
process.on('exit', exitHandler.bind(null, {cleanup: true}))

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit: true}))

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit: true}))
process.on('SIGUSR2', exitHandler.bind(null, {exit: true}))
process.on('SIGTERM', exitHandler.bind(null, {exit: true}))

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit: true}))



