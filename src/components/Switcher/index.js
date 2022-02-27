import React, { useState } from "react";
import cn from "./index.module.css";
import { cx } from "../../utils";

export const Switcher = ({ options }) => {
  const [selected, setSelected] = useState(0);

  return (
    <div className={cn.container}>
      {options.map((d, i) => (
        <div
          key={i}
          className={
            selected === i
              ? cx(cn.selected, cn.buttonContainer)
              : cx(cn.buttonContainer)
          }
        >
          <button
            onClick={() => {
              setSelected(i);
              if (d.onClick) d.onClick();
            }}
          >
            {d.label}
          </button>
        </div>
      ))}
    </div>
  );
};
