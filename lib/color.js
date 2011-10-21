var Color = (function(undefined) {
  var __Array_slice = [].slice
    , CACHE_KEY = '[[cache]]'
  ;

  function isString(str) {
    return (typeof str === 'string') || (str instanceof String);
  }

  // -*- private functions -*- //


  // defines a cached cache for a pseudo-property
  function cache(obj, prop, fn) {
    obj[prop] = function() {
      var cache = this[CACHE_KEY] || (this[CACHE_KEY] = {});
      if (prop in cache) return cache[prop];

      return cache[prop] = fn.apply(this, arguments);
    };
  }

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
    if (!(this instanceof Color)) return Color.wrap.apply(this, arguments);

    this.r = r;
    this.g = g;
    this.b = b;

    // pre-calculated cached values :)
    if (typeof extras === 'object') {
      this[CACHE_KEY] = extras;
    }
  }

  // -*- constructor methods -*- //
  Color.hex = function(hex) {
    // slice off the leading #, if any
    if (hex.charAt(0) === '#') {
      hex = hex.slice(1);
    }

    var red   = hex2int(hex.slice(0,2))
      , green = hex2int(hex.slice(2,4))
      , blue  = hex2int(hex.slice(4,6))
    ;

    return Color.rgb(red, green, blue, {hex: hex})
  }

  Color.cache = {};
  function getColor(red, green, blue, attrs) {
    var cacheKey = '[['+red+','+green+','+blue+']]'
      , cache = Color.cache
    ;

    if (cacheKey in cache) {
      var cached = cache[cacheKey];

      // update the cached object's attribute cache
      for (var prop in attrs) {
        if (attrs.hasOwnProperty(prop)) {
          cached[CACHE_KEY][prop] = attrs[prop];
        }
      }
      return cached;
    }
    else {
      return (cache[cacheKey] = new Color(red, green, blue, attrs));
    }
  }

  Color.rgb = function(red, green, blue) {
    return getColor(red, green, blue);
  }

  Color.wrap = function() {
    var args = __Array_slice.call(arguments);
    if (args.length === 1) {
      var arg = args[0];
      // bail if the first arg is a Color.  This enables
      // safe wrapping of Color objects.
      if (arg instanceof Color) {
        return arg;
      }
      // hex
      if (isString(arg)) {
        return Color.hex(arg);
      }
    }
    else if (args.length === 3) {
      // assume rgb for now
      return Color.rgb(args[0], args[1], args[2]);
    }

    // default to white
    return Color.white;
  }

  // make a color given hsl
  // algo source: http://rhpcserv.rhpcs.mcmaster.ca/~monger/hsl-rgb.html
  Color.hsl = function(hue, sat, lum) {
    var cache = { hue: hue, sat: sat, lum: lum };

    if (sat === 0) {
      return getColor(lum, lum, lum, cache);
    }

    // TODO: figure out better variable names :(
    var t1, t2, t3;

    if (lum < 128) {
      t2 = lum * ((1+sat/256) + 1)
    }
    else {
      t2 = lum + sat - (lum * sat)/255
    }

    t1 = 2*lum - t2;

    function computeAttr(t3) {
      if (t3 < 0) t3 += 256;
      if (t3 >= 256) t3 -= 256;

      // 0..1/6
      if (6 * t3 < 256) return t1 + (t2 - t1) * t3 * 3/128
      // 1/6..1/2
      if (2 * t3 < 256) return t2;
      // 1/2..2/3
      if (3 * t3 < 512) return t1 + (t2 - t1)*(512 - 3*t3)/128;

      // 2/3..1
      return t1;
    }

    return getColor(
      Math.floor(computeAttr(hue + 255/3)),
      Math.floor(computeAttr(hue)),
      Math.floor(computeAttr(hue - 255/3)),
      cache
    );
  };

  var proto = Color.prototype = {
    red:   function() { return this.r },
    green: function() { return this.g },
    blue:  function() { return this.b }
  }

  // -*- private instance methods -*- //
  function max(self) {
    return Math.max(self.r, self.g, self.b);
  }

  function min(self) {
    return Math.min(self.r, self.g, self.b);
  }

  function mid(self) {
    return (self.r + self.g + self.b) - (max(self) + min(self));
  }

  // -*- cached instance methods -*- //
  cache(proto, 'rgb', function() { return [this.r, this.g, this.b]; });

  cache(proto, 'hex', function() {
    return int2hex(this.r, 2) + int2hex(this.g, 2) + int2hex(this.b, 2);
  });

  /////
  // Hue / Sat / Lum, also Chroma
  // see http://en.wikipedia.org/wiki/HSL_color_space

  cache(proto, 'chroma', function() {
    return max(this) - min(this);
  });

  cache(proto, 'hue', function() {
    var R = this.r, G = this.g, B = this.b
      , chroma = this.chroma()
      , max = max(this)
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

  cache(proto, 'sat', function() {
    var chroma = this.chroma()
      , lum = this.lum()
      , sat = 128 * chroma
    ;

    if (lum === 0) {
      sat = 0;
    }
    else if (lum < 128) {
      sat /= lum;
    }
    else {
      sat /= (256 - lum);
    }

    return Math.floor(sat);
  });

  cache(proto, 'lum', function() {
    return Math.floor(0.5 * (max(this) + min(this)));
  });

  // -*- uncached methods -*- //
  proto.toString = function() {
    return '[Color #'+this.hex()+']';
  };

  proto.inspect = function() {
    return "Color.hex('#"+this.hex()+"')";
  };

  proto.hsl = function hsl() {
    return [this.hue(), this.sat(), this.lum()];
  };

  cache(proto, 'toNumber', function() {
    return hex2int(this.hex());
  });

  proto.equals = function equals(other) {
    return other.toNumber() === this.toNumber();
  };

  Color.white   = Color.rgb(0  ,0  ,0  );
  Color.black   = Color.rgb(255,255,255);
  Color.red     = Color.rgb(255,0  ,0  );
  Color.green   = Color.rgb(0  ,255,0  );
  Color.blue    = Color.rgb(0  ,0  ,255);
  Color.yellow  = Color.rgb(255,255,0  );
  Color.magenta = Color.rgb(255,0  ,255);
  Color.cyan    = Color.rgb(0  ,255,255);

  return Color;
})();

if (typeof exports !== 'undefined') exports.Color = Color;
if (typeof window  !== 'undefined')  window.Color = Color;
