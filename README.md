# Raspberry PI Recycling LED 

This little project is intends to read a iCAL Stream and highlight connected LEDs in their equivalent color according to the color of recycling bins.

In Germany this is mostly something like this:

* Blue: Paper
* Yellow: Plastic Recycling
* Red: Noxious Substances
* Green/Brown : Bio-Waste / "organic"
* Gray/Pink : residual waste

Depending on your local waste provider, you might need to adjust this.

## Config

in file `config/default.json`

```
{
  "iCalURL" : "http://neuss.mein-abfallkalender.de/ical.ics?sid=25167&cd=inline&ft=12&fp=next_1000&wids=645,646,647,648,649,650",
  "leds"    : [
    {
      "type"  : "Paper",
      "color" : "Blue",
      "gpio"  : 10
    },
    {
      "type"  : "Recycling",
      "color" : "Yellow",
      "gpio"  : 11
    },
    {
      "type"  : "Noxious Substances",
      "color" : "Red",
      "gpio"  : 12
    },
    {
      "type"  : "Bio-Waste",
      "color" : "Green",
      "gpio"  : 13
    },
    {
      "type"  : "Residual Waste",
      "color" : "Gray",
      "gpio"  : 14
    }
  ]
}
```