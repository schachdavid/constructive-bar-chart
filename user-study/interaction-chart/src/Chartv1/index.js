import { useMemo } from "react";
import { scaleLinear } from "d3-scale";
import { useData } from "./useData";

function Chart() {
  const data = useData();

  console.log(
    data?.map((d) => ({ id: d.id, numInteractions: d.numInteractions }))
  );

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
      const { blockMoves, dataSelections, buttonPress, id } = d;

      return (
        <g transform={`translate(0 ${i * 50})`}>
          <line x1="0" y1="50" x2="800" y2="50" stroke="#eaeaea" />
          {blockMoves.map((d) => {
            const size = d.quantity * 5;
            return (
              <line
                x1={xScale(d.seconds)}
                y1={50 - size}
                x2={xScale(d.seconds)}
                y2={50 + size}
                stroke={id.startsWith("A") ? "#95aaff" : "#FFDB86"}
              />
            );
          })}
          {dataSelections.map((d) => (
            <rect
              y={50 - 2.5}
              x={xScale(d.seconds) - 2.5}
              height={5}
              width={5}
              fill="#5656567d"
            />
          ))}
          {buttonPress.map((d) => (
            <circle cx={xScale(d.seconds)} cy="50" r="2.5" fill="#5656567d" />
          ))}
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
