var Color = (function(undefined) {

  // -*- private functions -*- //

  //////
  // defines an accessor method for a given
  // property.  Example:
  // 
  //    var foo = { a: accessor('b') };
  //    // setter
  //    foo.a(1) // => 1
  //    // sets the property
  //    foo.b // => 1
  //    // getter
  //    foo.a() // => 1
  function cache(prop, fn) {
    return function() {
      if (prop in this) return this[prop];

      return this[prop] = fn.apply(this, arguments);
    }
  }

  // defines a cached getter for a pseudo-property
  function getter(obj, prop, fn) {
    obj[prop] = cache('_'+prop, fn);
  }

  var hexInitCharCode = 'a'.charCodeAt(0);

  function hex2int(hex) {
    return parseInt(hex, 16);
  }

  function int2hex(_int, padLength) {
    var str = _int.toString(16);

    if (padLength !== undefined) {
      str = padLeft(str, padLength, '0');
    }

    return str;
  }

  function padLeft(str, len, padChar) {
    while (str.length < len) {
      str = padChar + str;
    }

    return str;
  }

  // -*- public class Color -*- //
  function Color(r, g, b, extras) {
    if (!this instanceof Color) return new Color(r, g, b);

    this.r = r;
    this.g = g;
    this.b = b;

    // pre-calculated cached values :)
    if (typeof extras === 'object') {
      for (var prop in extras) {
        if (extras.hasOwnProperty(prop)) {
          this['_'+prop] = extras[prop];
        }
      }
    }
  }

  Color.hex = function(hex) {
    var red   = hex2int(hex.slice(0,2))
      , green = hex2int(hex.slice(2,4))
      , blue  = hex2int(hex.slice(4,6))
    ;

    return new Color(red, green, blue, {hex: hex})
  }

  var proto = Color.prototype = {
    red:   function() { return this.r },
    green: function() { return this.g },
    blue:  function() { return this.b }
  }

  getter(proto, 'rgb', function() { return [this.r, this.g, this.b]; });
  getter(proto, 'toString', function() { 
    return '[Color #'+this.hex()+']';
  });

  getter(proto, 'hex', function() {
    return int2hex(this.r, 2) + int2hex(this.g, 2) + int2hex(this.b, 2);
  });

  /////
  // Hue / Sat / Lum, also Chroma
  // see http://en.wikipedia.org/wiki/HSL_color_space

  getter(proto, 'chroma', function() {
    var R = this.r, G = this.g, B = this.b;
    return Math.max(R,G,B) - Math.min(R,G,B);
  });

  getter(proto, 'hue', function() {
    var R = this.r, G = this.g, B = this.b
      , chroma = this.chroma()
      , max = Math.max(R,G,B)
      , hue
    ;
    
    if (chroma === 0) {
      hue = 0;
    }
    else if (max === R) {
      hue = (G - B) / chroma;
      hue %= 6;
      if (hue < 0) hue += 6; // mod doesn't fix sign
    }
    else if (max === G) {
      hue = 2 + (B - R) / chroma;
    }
    else if (max === B) {
      hue = 4 + (R - G) / chroma;
    }
    return Math.floor(hue * 256 / 6);
  });

  getter(proto, 'sat', function() {
    var chroma = this.chroma()
      , lum = this.lum()
      , sat
    ;

    if (lum === 0) {
      sat = 0;
    }
    else if (lum < 128) {
      sat = 128 * chroma / lum;
    }
    else {
      sat = 128 * chroma / (256 - lum);
    }

    return Math.floor(sat);
  });

  getter(proto, 'lum', function() {
    var R = this.r, G = this.g, B = this.b;
    return Math.floor(0.5 * (Math.max(R,G,B) + Math.min(R,G,B)));
  });

  proto.hsl = function hsl() {
    return { h: this.hue(), s: this.sat(), l: this.lum() };
  };

  getter(proto, 'toNumber', function() {
    return hex2int(this.hex());
  });

  proto.equals = function equals(other) {
    return other.toNumber() === this.toNumber();
  };

  Color.white   = new Color(0  ,0  ,0  );
  Color.black   = new Color(255,255,255);
  Color.red     = new Color(255,0  ,0  );
  Color.green   = new Color(0  ,255,0  );
  Color.blue    = new Color(0  ,0  ,255);
  Color.yellow  = new Color(255,255,0  );
  Color.magenta = new Color(255,0  ,255);
  Color.cyan    = new Color(0  ,255,255);

  return Color;
})();

if (typeof exports !== 'undefined') exports.Color = Color;
if (typeof window  !== 'undefined')  window.Color = Color;
