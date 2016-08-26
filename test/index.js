'use strict';

const tls = require('tls');
const assert = require('assert');
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();
const EventEmitter = require('events');
const moment = require('moment');

const certificate = require('..');
const validUntil = moment().add(92, 'days');

describe('Certificate expiry', () => {
  let socket;

  beforeEach(() => {
    socket = new EventEmitter();

    socket.getPeerCertificate = sandbox.stub().returns({
      valid_to: validUntil.format('MMM D H:mm:ss YYYY z')
    });
    sandbox.stub(tls, 'connect').returns(socket);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('expiresOn', () => {
    it('returns the date the certificate expires on', (done) => {
      certificate.expiresOn('host', (err, expiryDate) => {
        assert.ifError(err);

        assert.equal(expiryDate, validUntil.format());
        done();
      });

      socket.emit('secureConnect');
    });

    it('returns an error when tls returns an error', (done) => {
      certificate.expiresOn('host', (err) => {
        assert.ok(err);
        assert.equal(err.message, 'Oh, my.');
        done();
      });

      socket.emit('error', new Error('Oh, my.'));
    });
  });

  describe('expiresIn', () => {
    it('returns the duration from now until the hosts certificate expires in the unit specified', (done) => {
      certificate.expiresIn('host', 'minutes', (err, minutesLeft) => {
        assert.ifError(err);
        assert.strictEqual(minutesLeft, 132539);
        done();
      });

      socket.emit('secureConnect');
    });

    it('returns a duration object when no unit is specified', (done) => {
      certificate.expiresIn('host', (err, durationLeft) => {
        assert.ifError(err);
        assert.strictEqual(parseInt(durationLeft.asDays()), 92);
        done();
      });

      socket.emit('secureConnect');
    });

    it('returns an error when tls returns an error', (done) => {
      certificate.expiresIn('host', (err) => {
        assert.ok(err);
        assert.equal(err.message, 'Oh, my.');
        done();
      });

      socket.emit('error', new Error('Oh, my.'));
    });
  });

  describe('daysLeft', () => {
    it('retruns the number of days until the certificate of the host expires', (done) => {
      certificate.daysLeft('host', (err, daysLeft) => {
        assert.ifError(err);
        assert.strictEqual(daysLeft, 92);
        done();
      });

      socket.emit('secureConnect');
    });

    it('returns an error when tls returns an error', (done) => {
      certificate.daysLeft('host', (err) => {
        assert.ok(err);
        assert.equal(err.message, 'Oh, my.');
        done();
      });

      socket.emit('error', new Error('Oh, my.'));
    });
  });
});
