# Raspberry PI Recycling LED 

This little project is intends to read a iCAL Stream and highlight connected LEDs in their equivalent color according to the color of recycling bins.

In Germany this is mostly something like this:

* Blue: Paper
* Yellow: Plastic Recycling
* Red: Noxious Substances
* Green/Brown : Bio-Waste / "organic"
* Gray/Pink : residual waste

## Installation

1. Install NodeJS on your Raspberry PI https://thisdavej.com/beginners-guide-to-installing-node-js-on-a-raspberry-pi/#install-node
2. Clone the project on your Raspberry PI and run node.js

```
cd ~
git clone https://github.com/bartrail/rpi-recycling-led.git
cd rpi-recycling-led
npm install
npm start

```

## Mapping

This project uses [iCal.js](https://github.com/mozilla-comm/ical.js/wiki) to parse the iCal files. Right now fetched from https://www.mein-abfallkalender.de
To map the LEDs to the appropriate Events, change the `leds.summary` entries to the according
 `summary` of the Event name. This wording is currently the only mapping available.



## Config Adjustments

Depending on your local waste provider, you might need to adjust this.

in file `config/default.json`

```
{
  "iCalURL" : "http://neuss.mein-abfallkalender.de/ical.ics?sid=25167&cd=inline&ft=12&fp=next_1000&wids=645,646,647,648,649,650",
  "status"  : {
    "error" : {
      "gpio" : 12
      // if error occured, this gpio will blink
    }
  },
  "leds"    : [
    {
      // Paper
      "summary" : "Papiertonne",
      "color"   : "Blue",
      "gpio"    : 10
    },
    {
      // Recycling
      "summary" : "Gelbe Tonne / Gelber Sack",
      "color"   : "Yellow",
      "gpio"    : 11
    },
    {
      // Noxious Substances
      "summary" : "Schadstoffmobil",
      "color"   : "Red",
      "gpio"    : 12
    },
    {
      // Bio-Waste / Organic
      "summary" : "Biotonne",
      "color"   : "Green",
      "gpio"    : 13
    },
    {
      // Residual Waste
      "summary" : "Restmüll-Grau",
      "color"   : "Gray",
      "gpio"    : 14
    }
  ]
}
```
