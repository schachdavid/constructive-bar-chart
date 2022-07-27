import React, { useEffect, useMemo } from 'react';
import { line } from 'd3-shape';
import cn from './index.module.css';
import { cx, updateExtent } from '../../../utils';

export const Line = (props) => {
  const {
    data,
    getX,
    getY,
    scaleX,
    scaleY,
    className,
    setXExtent,
    setYExtent
  } = props;

  useEffect(() => {
    setYExtent((yExtent) =>
      updateExtent(yExtent, getY, data)
    );
    setXExtent((xExtent) =>
      updateExtent(xExtent, getX, data)
    );
  }, [data, getX, getY, setXExtent, setYExtent]);

  const path = useMemo(
    () =>
      line()
        .x((d) => scaleX(getX(d)))
        .y((d) => scaleY(getY(d)))(data),
    [data, getX, getY, scaleY, scaleX]
  );

  return (
    <path d={path} className={cx(cn.line, className)} />
  );
};
