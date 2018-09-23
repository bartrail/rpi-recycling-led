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

const iCalCrawler = require('./components/eventDate/iCalCrawler.js')
const Schedule    = require('./components/eventDate/Schedule.js')

let url = config.get('iCalURL')

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
        name       : 'list-events',
        description: 'Lists all events found in the given URL (for debugging purposes)'
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
  {name: 'listEvents', type: Boolean},
  {name: 'verbose', alias: 'v', type: Boolean},
  {name: 'help', alias: 'h', type: Boolean},
]

const options = commandLineArgs(optionDefinitions)

let leds = config.get('leds')

let crawler = new iCalCrawler(url)

crawler.fetch().then((eventDates) => {
  if (options.listEvents) {
    _.forEach(eventDates, (eventDate, idx) => {
      console.log(eventDate.toString())
    })

    // abort if we don't have the --run option
    if (options.run !== true) {
      return

    }
  }

  if (options.run !== true) {
    console.log('Please start with --run to run it')
    console.log(usage)
    return
  }

  let schedule = new Schedule(eventDates)

}).catch((error) => {

  console.error('Error fetching or parsing data')
  console.error(error);

})


