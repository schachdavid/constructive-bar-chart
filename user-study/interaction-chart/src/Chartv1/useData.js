import { useEffect, useState } from "react";
import { csvParse } from "d3-dsv";
import { csvText } from "../interactionsCsv";

function toSeconds(timestamp) {
  if (timestamp.includes(":")) {
    const a = timestamp.split(":");
    return +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
  }
  return timestamp;
}

export function useData() {
  const [data, setData] = useState();

  useEffect(() => {
    const data = csvParse(csvText, (d) => {
      return {
        id: d.participant_id,
        seconds: toSeconds(d.timestamp),
        interactionType: d.interaction_type,
        quantity: +d.quantity,
        num_blocks_in_place: +d.num_blocks_in_place,
      };
    });

    const ids = [...new Set(data.map((d) => d.id))];

    setData(
      ids
        .map((id) => {
          const series = data.filter((d) => d.id === id);

          const blockMoves = series.filter(
            (d) => d.interactionType === "block_move"
          );
          const dataSelections = series.filter(
            (d) => d.interactionType === "dataset_selection"
          );

          const buttonPress = series.filter(
            (d) => d.interactionType === "button_press"
          );

          const numInteractions = series.length;

          return {
            id,
            series,
            blockMoves,
            dataSelections,
            buttonPress,
            numInteractions,
          };
        })
        .sort((a, b) => (a.numInteractions < b.numInteractions ? 1 : -1))
    );
  }, []);

  return data;
}
