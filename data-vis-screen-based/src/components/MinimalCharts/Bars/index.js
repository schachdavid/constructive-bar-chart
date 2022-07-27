import React, { useEffect, useMemo } from "react";
import cn from "./index.module.css";
import { cx, updateExtent } from "../../../utils";
import { scaleBand } from "d3-scale";

export const Bars = ({ barWidth, ...props }) => {
  const {
    className,
    data,
    height,
    width,
    getX,
    getY,
    scaleY,
    setYExtent,
    showTicks,
  } = props;

  useEffect(() => {
    setYExtent((yExtent) => updateExtent(yExtent, getY, data));
  }, [data, getY, setYExtent]);

  const scaleX = useMemo(
    () =>
      scaleBand().domain(data.map(getX)).range([0, width]).paddingInner(0.2),
    [data, getX, width]
  );

  const mask = useMemo(() => {
    if (!showTicks) return;
    const ticks = scaleY.ticks(5);
    return (
      <mask id="tickLines">
        <rect x="0" y="0" width={width * 2} height={height * 2} fill="white" />
        {ticks.map((t, i) => (
          <g key={t} transform={`translate(0,${scaleY(t)})`}>
            <line
              key={i}
              stroke="black"
              x1={0}
              x2={width * 2}
              y1={0}
              y2={0}
              className={cn.tick}
            />
          </g>
        ))}
      </mask>
    );
  }, [height, scaleY, showTicks, width]);

  return (
    <g>
      {mask}
      <g mask={showTicks && "url(#tickLines)"}>
        {data.map((d) => {
          const height = scaleY.range()[1] - scaleY(getY(d));
          return (
            <g
              key={getX(d)}
              transform={`translate(${scaleX(getX(d)) + 10},${
                scaleY(scaleY.domain()[1]) - height
              })`}
            >
              <rect
                className={cx(cn.bar, className)}
                height={height}
                width={barWidth || scaleX.bandwidth()}
                x={barWidth ? scaleX.bandwidth() / 2 - barWidth / 2 : null}
              />
              <text
                textAnchor="middle"
                alignmentBaseline="central"
                x={scaleX.bandwidth() / 2}
                y={height + 20}
              >
                {getX(d)}
              </text>
            </g>
          );
        })}
      </g>
    </g>
  );
};
