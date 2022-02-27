import React from "react";
import { useDrag } from "react-dnd";
import { dndType } from "../config";
import cn from "./index.module.css";

export const Block = ({ scaledSize, height, size, label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: dndType,
    item: { height, width: scaledSize },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      console.log("dropped", dropResult);
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  return (
    <div className={cn.container} style={{ height }}>
      <div
        ref={drag}
        className={cn.block}
        style={{ width: scaledSize, cursor: isDragging ? "grabbing" : "grab" }}
      />
      {label && <span className={cn.label}>{`${size} ${label}`}</span>}
    </div>
  );
};
