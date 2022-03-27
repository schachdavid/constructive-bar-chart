import React, { useMemo } from "react";
import cn from "./index.module.css";
import { cx } from "../../utils";

const p1 = { x: 585, y: 180 };
const p2 = { x: 505, y: 230 };

export const Swoopy = ({ className }) => {
  const linePath = useMemo(() => {
    // mid-point of line:
    var mpx = (p2.x + p1.x) * 0.5;
    var mpy = (p2.y + p1.y) * 0.5;

    // angle of perpendicular to line:
    var theta = Math.atan2(p2.y - p1.y, p2.x - p1.x) - Math.PI / 2 - 0.2;

    // distance of control point from mid-point of line:
    var offset = 30;

    // location of control point:
    var c1x = mpx + offset * Math.cos(theta);
    var c1y = mpy + offset * Math.sin(theta);

    return `M${p1.x} ${p1.y} Q${c1x} ${c1y} ${p2.x} ${p2.y}`;
  }, []);

  return (
    <svg className={cx(className, cn.container)}>
      <defs>
        <marker
          id="head"
          orient="auto"
          markerWidth="3"
          markerHeight="4"
          refX="0.1"
          refY="2"
        >
          <path d="M0,0 V4 L2,2 Z" fill="black" />
        </marker>
      </defs>
      <path
        id="arrow-line"
        stroke-width="6"
        fill="none"
        stroke="white"
        d={linePath}
      />
      <text
        x={p1.x - 12}
        y={p1.y + (Math.abs(p1.y - p2.y) / 2) * 1.5}
        className={cn.label}
      >
        Drag and Drop
      </text>
      <text
        x={p1.x - 12}
        y={p1.y + (Math.abs(p1.y - p2.y) / 2) * 2}
        className={cn.label}
      >
        Blocks
      </text>
      <path
        marker-end="url(#head)"
        id="arrow-line"
        stroke-width="4"
        fill="none"
        stroke="white"
        d={linePath}
      />
      <path
        id="arrow-line"
        marker-end="url(#head)"
        stroke-width="2"
        fill="none"
        stroke="black"
        d={linePath}
      />
    </svg>
  );
};
