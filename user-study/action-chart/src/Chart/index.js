import { useMemo } from "react";
import { scaleLinear } from "d3-scale";
import { useData } from "./useData";
import { max } from "d3-array";

function Actions({ series, xScale, fill }) {
  return series.map((d) => (
    <rect
      x={Math.round(xScale(d.secondsStart)*100)/100}
      y={30}
      height={40}
      width={Math.round(xScale(d.secondsEnd - d.secondsStart)*100)/100}
      fill={fill}
    />
  ));
}

function Chart() {
  const data = useData();

  var xScale = useMemo(() => {
    if (!data) return;
    return scaleLinear()
      .domain([0, 15 * 60 + 5])
      .range([0, 800]);
  }, [data]);

  const axis = useMemo(() => {
    if (!data) return;
    return [...Array(16).keys()].map((d) => (
      <line
        x1={xScale(d * 60)}
        y1={0}
        x2={xScale(d * 60)}
        y2={5}
        stroke="#ACACAC"
      />
    ));
  }, [data, xScale]);

  const lines = useMemo(() => {
    if (!data) return;

    return data.map((d, i) => {
      const {
        id,
        series,
        understand,
        read,
        guess,
        correct,
        experiment,
        other,
      } = d;

      const maxSeconds = max(series, (k) => +k.secondsEnd);
      return (
        <g transform={`translate(0 ${i * 50})`}>
          <Actions series={understand} xScale={xScale} fill="#9A5CFF" />
          <Actions series={read} xScale={xScale} fill="#7BDC90" />
          <Actions series={guess} xScale={xScale} fill="#5E7EFC" />
          <Actions series={correct} xScale={xScale} fill="#FF525F" />
          <Actions series={experiment} xScale={xScale} fill="#FFC63F" />
          <Actions series={other} xScale={xScale} fill="#E7E7E7" />
          <rect
            y={50 - 20}
            height={40}
            width={xScale(maxSeconds)}
            fillOpacity={0}
            stroke="#C0C0C0"
          />
        </g>
      );
    });
  }, [data, xScale]);

  if (!data) return null;

  return (
    <div>
      <svg height={548} width={800}>
        {axis}
        {lines}
      </svg>
    </div>
  );
}

export default Chart;
