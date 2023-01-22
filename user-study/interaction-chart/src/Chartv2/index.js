import { useMemo } from "react";
import { scaleLinear } from "d3-scale";
import { useData } from "./useData";
import { max } from "d3-array";

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
      const { series, blockMoves, dataSelections, buttonPress, id } = d;

      const maxSeconds = max(series, (k) => +k.seconds) + 5;
      return (
        <g transform={`translate(0 ${i * 50})`}>
          {/* <line x1="0" y1="50" x2="800" y2="50" stroke="#eaeaea" /> */}
          <rect
            y={50 - 20}
            height={40}
            width={xScale(maxSeconds)}
            fillOpacity={0}
            stroke="#C0C0C0"
          ></rect>
          {blockMoves.map((d) => {
            const size = d.quantity * 8;
            return (
              <line
                x1={xScale(d.seconds)}
                y1={70 - size}
                x2={xScale(d.seconds)}
                y2={70}
                stroke={id.startsWith("A") ? "#5675F3" : "#FFC63F"}
              />
            );
          })}
          {dataSelections.map((d) => (
            <line
              x1={xScale(d.seconds)}
              y1={30}
              x2={xScale(d.seconds)}
              y2={70}
              stroke="#7BDC90"
            />
            // <rect
            //   y={50 - 2.5}
            //   x={xScale(d.seconds) - 2.5}
            //   height={5}
            //   width={5}
            //   fill="#5656567d"
            // />
          ))}
          {buttonPress.map((d) => 
          <line
          x1={xScale(d.seconds)}
          y1={30}
          x2={xScale(d.seconds)}
          y2={70}
          stroke="#FF868F"
        />)}
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
