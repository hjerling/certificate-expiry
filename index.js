'use strict';

const tls = require('tls');
const moment = require('moment');

function getExpiryDate(host, cb) {
  const socket = tls.connect({
    port: 443,
    host: host,
    servername: host
  });

  socket.on('secureConnect', () => {
    const peerCertificate = socket.getPeerCertificate();

    cb(null, moment(new Date(peerCertificate.valid_to)));
  });

  socket.on('error', (error) => {
    cb(error);
  });
}

function expiresIn(host, unit, cb) {
  const now = moment();

  if (typeof unit === 'function') {
    cb = unit;
    unit = null;
  }

  getExpiryDate(host, (err, expiry) => {
    if (err) return cb(err);

    const durationLeft = moment.duration(expiry.diff(now));
    if (unit === null) return cb(null, durationLeft);

    const timeLeftAsUnit = parseInt(durationLeft.as(unit));

    cb(null, timeLeftAsUnit);
  });
}

module.exports.expiresOn = function (host, cb) {
  getExpiryDate(host, (err, expiryDate) => {
    if (err) return cb(err);

    cb(null, expiryDate.format());
  });
};

module.exports.expiresIn = expiresIn;

module.exports.daysLeft = function (host, cb) {
  expiresIn(host, 'days', cb);
};
