import React, { useMemo, useState } from "react";
import { scaleTime, scaleLinear } from "d3-scale";

export const Chart = ({
  data,
  getX,
  getY,
  scaleY: customScaleY,
  children,
  height = 200,
  width = 600,
  margin = [30, 30, 50, 30],
}) => {
  const [yExtent, setYExtent] = useState([0, 0]);
  const [xExtent, setXExtent] = useState();

  const scaleX = useMemo(
    () =>
      scaleTime()
        .domain(xExtent || [0, 0])
        .range([0, width]),
    [width, xExtent]
  );

  const scaleY = useMemo(
    () =>
      customScaleY ||
      scaleLinear()
        .domain(yExtent || [0, 0])
        .range([0, height])
        .nice(),
    [customScaleY, height, yExtent]
  );

  return (
    <svg
      height={margin[0] + height + margin[2]}
      width={margin[3] + width + margin[1]}
    >
      <g transform={`translate(${margin[3]}, ${margin[0]})`}>
        {React.Children.map(children, (child) =>
          React.cloneElement(child, {
            height,
            width,
            getX,
            getY,
            scaleX,
            scaleY,
            xExtent,
            data,
            setXExtent,
            yExtent,
            setYExtent,
            ...child.props,
          })
        )}
        )
      </g>
    </svg>
  );
};
