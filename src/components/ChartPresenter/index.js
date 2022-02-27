import React from "react";
import { cx } from "../../utils";
import cn from "./index.module.css";

export const ChartPresenter = ({ children, title, className }) => {
  return (
    <div className={cx(cn.container, className)}>
      {title && <h2 className={cn.title}>{title}</h2>}
      {children}
    </div>
  );
};
