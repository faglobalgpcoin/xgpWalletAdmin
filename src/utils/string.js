const BigNumber = require('bignumber.js');

export function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp);
  var months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  // var hour = a.getHours();
  // var min = a.getMinutes();
  // var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ';
  // + hour + ':' + min + ':' + sec;
  return time;
}

export function timeConverterNumber(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp);
  var months = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time =
    date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
  return time;
}

export function timeConverterNumberArr(UNIX_timestamp) {
  var result = [];
  var a = new Date(UNIX_timestamp);
  var months = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
  ];
  result.push(a.getDate() < 10 ? '0' + a.getDate() : '' + a.getDate());
  result.push(months[a.getMonth()]);
  result.push(a.getFullYear().toString());
  // var year = a.getFullYear();
  // var month = months[a.getMonth()];
  // var date = a.getDate();
  // var hour = a.getHours();
  // var min = a.getMinutes();
  // var sec = a.getSeconds();
  // var time =
  //   date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
  return result;
}

/**
 * 콤마 & 소수점 이하 0 짜르기
 *
 * @param value
 * @param decimalPosition
 * @returns {string}
 * @constructor
 */
export function NumberWithCommas(value, decimalPosition) {
  value = new BigNumber(value);
  if (value.comparedTo(0) === 1) {
    let parts = value.toString().split('.');
    let intPart = addCommas(parts[0]);
    if (parts[1]) {
      let floatPart = trimDecimal(parts[1], decimalPosition);
      return intPart + (parts[1] * 1 !== 0 ? '.' + floatPart : '');
    }
    return intPart + '';
  } else {
    return value + '';
  }
}

/**
 * 콤마 찍기
 *
 * @param number
 * @returns {string}
 */
function addCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 소수점 0 짜르기
 * @param decimal
 * @param position
 * @returns {string}
 */
function trimDecimal(decimal, position) {
  if (position > 0) {
    decimal = decimal.substr(0, position);
  }
  let floatLength = decimal.length | 0;
  let lastPosition = 0;
  for (let i = floatLength - 1; i >= 0; i--) {
    let temp = decimal.substr(i, 1);
    if (temp * 1 > 0) {
      lastPosition = i;
      break;
    }
  }
  return decimal.substr(0, lastPosition + 1);
}
