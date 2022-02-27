import React, { useMemo } from 'react';
import cn from './index.module.css';
import { timeFormatLocale } from 'd3-time-format';
import locale from 'd3-time-format/locale/de-DE.json';

export const XAxis = ({ className, ...props }) => {
  const { scaleX, scaleY } = props;

  const format = timeFormatLocale(locale).format('%-d. %b');

  const ticks = useMemo(() => scaleX.ticks(3), [scaleX]);

  return (
    <g transform={`translate(0, ${scaleY.range()[1]})`}>
      {ticks.map((t) => (
        <g
          key={t}
          transform={`translate(${scaleX(t) + 5},4)`}
        >
          <text
            textAnchor='middle'
            alignmentBaseline='central'
            y='16'
          >
            {format(t)}
          </text>
          <line
            x1={0}
            x2={0}
            y1={0}
            y2={5}
            className={cn.tick}
          />
        </g>
      ))}
    </g>
  );
};
