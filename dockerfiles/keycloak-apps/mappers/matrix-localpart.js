function convertBase(str, fromBase, toBase) {
  var DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz";

  var add = function add(x, y, base) {
    var z = [];
    var n = Math.max(x.length, y.length);
    var carry = 0;
    var i = 0;

    while (i < n || carry) {
      var xi = i < x.length ? x[i] : 0;
      var yi = i < y.length ? y[i] : 0;
      var zi = carry + xi + yi;
      z.push(zi % base);
      carry = Math.floor(zi / base);
      i++;
    }

    return z;
  };

  var multiplyByNumber = function multiplyByNumber(num, x, base) {
    if (num < 0) return null;
    if (num == 0) return [];
    var result = [];
    var power = x;

    while (true) {
      num & 1 && (result = add(result, power, base));
      num = num >> 1;
      if (num === 0) break;
      power = add(power, power, base);
    }

    return result;
  };

  var parseToDigitsArray = function parseToDigitsArray(str, base) {
    var digits = str.split('');
    var arr = [];

    for (var i = digits.length - 1; i >= 0; i--) {
      var n = DIGITS.indexOf(digits[i]);
      if (n == -1) return null;
      arr.push(n);
    }

    return arr;
  };

  var digits = parseToDigitsArray(str, fromBase);
  if (digits === null) return null;
  var outArray = [];
  var power = [1];

  for (var i = 0; i < digits.length; i++) {
    digits[i] && (outArray = add(outArray, multiplyByNumber(digits[i], power, toBase), toBase));
    power = multiplyByNumber(fromBase, power, toBase);
  }

  var out = '';

  for (var _i = outArray.length - 1; _i >= 0; _i--) {
    out += DIGITS[outArray[_i]];
  }

  return out;
}

// sub is a uuid v4
// https://www.uuidgenerator.net/version4
// of the form:
// 082adaca-540a-4a80-9354-d6607d28300c
// remove `-`
// 082adaca540a4a809354d6607d28300c
// take last 16 chars (which is RandC + a var) - https://datatracker.ietf.org/doc/html/rfc9562#uuidv4fields
// 9354d6607d28300c
// convert it to base36
// 28nosjs1wcj64

exports = convertBase(uuid.replace(/-/gi, '').slice(-16), 16, 36);
