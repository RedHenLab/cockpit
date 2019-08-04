import React from 'react';
import moment from 'moment';

export function formatDate(datestring, asElement = true) {
  if (!datestring) {
    return <br />;
  }
  const date = moment(datestring).format('MMMM Do YYYY, h:mm a');
  return asElement ? (<>{date}</>) : date;
}

export function formatSize(sizeInBytes, format = 'TB') {
  const divisor = (format === 'TB') ? 1000000000 : 1000000;
  return Number.parseFloat(sizeInBytes / divisor).toFixed(2);
}

/**
 * Returns total disk usage fraction 
 * @param {*} disks 
 */
export function calcDiskUsage(disks) { 
  let used = 0, available = 0;
  for (const disk of disks) {
    used += disk.used;
    available += disk.available;
  }
  return {used, available, remaining: (used)/(used+available)}
}