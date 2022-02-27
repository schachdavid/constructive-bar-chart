import { extent } from 'd3-array';

export const cx = (...classNames) => classNames.join(' ');

export const updateExtent = (extentArr, get, data) => {
  const newExtent = extent(data, get);
  return [
    Math.max(...(extentArr || []), ...newExtent),
    Math.min(...(extentArr || []), ...newExtent)
  ];
};
