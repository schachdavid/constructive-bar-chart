import React, { useEffect, useMemo } from 'react';
import cn from './index.module.css';
import { cx, updateExtent } from '../../../utils';
import { scaleBand } from 'd3-scale';

export const BoxPlot = ({
  getMin = (d) => d.min,
  getMax = (d) => d.max,
  getMedian = (d) => d.median,
  getFirstQuartile = (d) => d.firstQuartile,
  getThirdQuartile = (d) => d.thirdQuartile,
  ...props
}) => {
  const {
    className,
    data,
    width,
    getX,
    getY,
    scaleY,
    setYExtent
  } = props;

  useEffect(() => {
    setYExtent((yExtent) =>
      updateExtent(yExtent, getY, data)
    );
  }, [data, getY, setYExtent]);

  const scaleX = useMemo(
    () =>
      scaleBand()
        .domain(data.map(getX))
        .range([0, width])
        .paddingInner(0.2),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scaleY, width]
  );

  return (
    <g>
      {data.map((d) => {
        const zeroAxisY = scaleY.range()[1];
        const width = scaleX.bandwidth();
        const center = width / 2;
        return (
          <g
            key={getX(d)}
            transform={`translate(${scaleX(getX(d)) + 10},${
              scaleY(scaleY.domain()[1]) - zeroAxisY
            })`}
          >
            <line
              x1={center}
              x2={center}
              y1={scaleY(getMin(d))}
              y2={scaleY(getFirstQuartile(d))}
              className={cx(cn.line, className)}
            />
            <line
              x1={center}
              x2={center}
              y1={scaleY(getThirdQuartile(d))}
              y2={scaleY(getMax(d))}
              className={cx(cn.line, className)}
            />
            <circle
              cx={center}
              cy={scaleY(getMedian(d))}
              r='3'
            />
            <text
              textAnchor='middle'
              alignmentBaseline='central'
              x={center}
              y={zeroAxisY + 20}
            >
              {getX(d)}
            </text>
          </g>
        );
      })}
    </g>
  );
};
