import React, { useMemo } from 'react';
import cn from './index.module.css';

export const YAxis = ({
  className,
  showTicks = true,
  ...props
}) => {
  const { scaleX, scaleY } = props;

  const ticks = useMemo(() => scaleY.ticks(5), [scaleY]);

  return (
    <g
      transform={`translate(${scaleX.range()[0] - 10}, 0)`}
    >
      {ticks.map((t) => (
        <g key={t} transform={`translate(0,${scaleY(t)})`}>
          <text
            x={-6}
            textAnchor='end'
            alignmentBaseline='central'
          >
            {t}
          </text>
          {showTicks && (
            <line
              x1={0}
              x2={5}
              y1={0}
              y2={0}
              className={cn.tick}
            />
          )}
        </g>
      ))}
    </g>
  );
};
