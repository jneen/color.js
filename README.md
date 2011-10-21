# Color.js: the missing color library

Color.js is a very thin abstraction around a color, with a few bells on.

### Normal colors:
``` javascript
// normal colors
Color.white // => Color('ffffff')
Color.black // => Color('000000')
Color.red   // => Color('ff0000')
```


### custom colors, with nifty query methods!
``` javascript
Color('00FF10').toString() // => "#00FF10"
Color('00FF10').red()      // => 0
Color('00FF10').green()    // => 255
Color('00FF10').blue()     // => 16
Color('00FF10').rgb()      // => [0, 255, 16]
Color.rgb(0, 255, 16)      // => Color('00FF10')
```

### hsl conversion!
``` javascript
Color('112233').hue()  // => 149
Color('112233').sat()  // => 128
Color('112233').lum()  // => 34
Color('112233').hsl()  // => [149, 128, 34]
// NB: This conversion is pretty buggy, and the algo needs
// a look from someone who knows a thing or two about the hsl space.
Color.hsl(149, 128, 34) // => Color('112233')
```

## TODO
* fix the hsl->rgb algo
* color transforms (e.g. `myColor.lum(-20)` returns a darker color)
