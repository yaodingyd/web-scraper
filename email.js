function decrypt (email) {
  var e, r, n, i, a = email;
  for (e = "", r = parseInt(a.substr(0, 2), 16), n = 2; a.length - n; n += 2) {
    i = parseInt(a.substr(n, 2), 16) ^ r, e += String.fromCharCode(i);
  }
  return e;
}

module.exports = decrypt;