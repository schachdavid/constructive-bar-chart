import { extent } from "d3-array";

export function cx(...classNames) {
  return classNames.join(" ");
}

export function updateExtent(extentArr, get, data) {
  const newExtent = extent(data, get);
  return [
    Math.max(...(extentArr || []), ...newExtent),
    Math.min(...(extentArr || []), ...newExtent),
  ];
}

export function fieldsToBlockSums(fields) {
  return fields.map((d) => d.reduce((a, b) => a + b, 0) * 2);
}

const formattingConfig = [
  {
    factor: 1000000000000,
    singular: "Billion",
    plural: "Billionen",
    short: "Bil.",
  },
  {
    factor: 1000000000,
    singular: "Milliarde",
    plural: "Milliarden",
    short: "Mrd.",
  },
  {
    factor: 1000000,
    singular: "Million",
    plural: "Millionen",
    short: "Mio.",
  },
  {
    factor: 1000,
    singular: "Tausend",
    plural: "Tausend",
    short: "Tsd.",
  },
];

export function formatNumberWithSuffix(x, short) {
  console.log(x, short);
  const levelConfig = formattingConfig.find((d) => d.factor <= x);
  if (!levelConfig) return `${x}`;
  let num = x / levelConfig.factor;
  num = Math.round(num * 10) / 10;
  const suffix = short
    ? levelConfig.short
    : num === 1
    ? levelConfig.singular
    : levelConfig.plural;
  return `${num}\u2009${suffix}`;
}
