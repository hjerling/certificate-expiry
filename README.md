# certificate-expiry

Check when a certificate for a domain expires.

## Installation

```
npm install certificate-expiry
```

## Usage
```js
const cert = require('certificate-expiry');

cert.daysLeft('bbc.co.uk', (err, daysLeft) => {
  console.log(daysLeft);
});
```

```js
const cert = require('certificate-expiry');

cert.expiresIn('bbc.co.uk', 'hours', (err, hoursLeft) => {
  console.log(hoursLeft);
});
```

## API

### `cert.daysLeft(host, callback)`
* `host` - the host for the certificate you want to check. (example: *'bbc.co.uk'* or *'google.com'*)
* `callback` - returns an error or the number of days until the certificate expires as an integer. (example: *104*)

### `cert.expiresOn(host, callback)`
* `host` - the host for the certificate you want to check. (example: *'bbc.co.uk'* or *'google.com'*)
* `callback` - returns an error or the date of expiry as a string. (example: *'2017-03-15T17:01:06+00:00'*)

### `cert.expiresIn(host, unit, callback)`
* `host` - the host for the certificate you want to check. (example: *'bbc.co.uk'* or *'google.com'*)
* `unit` - *optional* - unit of measurement as string. Accepts same units as [moment duration create](http://momentjs.com/docs/#/durations/creating/). If this argument is omitted a [moment duration object](http://momentjs.com/docs/#/durations/) is returned in the `callback`. (example: *'days'*, *'hours'*, *'minutes'*)
* `callback` - returns an error or the number of `unit`s left until the certificate expires. (example: *92*) If a `unit` is not specified the return value is a [moment duration object](http://momentjs.com/docs/#/durations/).
