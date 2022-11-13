import { useEffect, useState } from "react";
import { csvParse } from "d3-dsv";
import { csvText } from "../actionsCsv";

function toSeconds(timestamp) {
  if (timestamp.includes(":")) {
    const a = timestamp.split(":");
    return +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
  }
  return timestamp;
}

function getActionsOfType(series, type) {
  return series.filter((d) => d.actionType === type);
}

function getTotalTime(series) {
  return series.reduce(
    (totalTime, cur) => totalTime + (cur.secondsEnd - cur.secondsStart),
    0
  );
}

export function useData() {
  const [data, setData] = useState();

  useEffect(() => {
    const data = csvParse(csvText, (d) => {
      return {
        id: d.participant_id,
        secondsStart: toSeconds(d.timestamp),
        actionType: d.action_type,
      };
    });

    const ids = [...new Set(data.map((d) => d.id))];

    setData(
      ids
        .map((id) => {
          const series = data
            .filter((d) => d.id === id)
            .sort((a, b) => a.secondsStart - b.secondsStart)
            .map((d, i, arr) => ({
              ...d,
              secondsEnd: arr[i + 1]?.secondsStart,
            }))
            .slice(0, -1);

          const understand = getActionsOfType(series, "understand");
          const read = getActionsOfType(series, "read");
          const guess = getActionsOfType(series, "guess");
          const correct = getActionsOfType(series, "correct");
          const experiment = getActionsOfType(series, "experiment");
          const other = getActionsOfType(series, "other");
      
          return {
            id,
            series,
            understand,
            read,
            guess,
            correct,
            experiment,
            other,
          };
        })
        .sort((a, b) => (a.id > b.id ? 1 : -1))

      // .sort((a, b) => (a.numInteractions < b.numInteractions ? 1 : -1))
    );
  }, []);

  return data;
}
