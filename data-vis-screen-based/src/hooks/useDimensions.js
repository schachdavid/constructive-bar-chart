import { useEffect, useState, useCallback } from "react";

import debounce from 'debounce';

export const useDimensions = function (initialSize = {width: null, height: null}) {
  const [size, setSize] = useState(initialSize);
  const [node, setNode] = useState(null);

  const ref = useCallback((node) => {
    setNode(node);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      window.requestAnimationFrame(() => {
        if (node) {
          setSize({
            width: node.clientWidth,
            height: node.clientHeight,
          });
        }

        // TODO: remove
        window.requestAnimationFrame(() => {
          if (node) {
            setSize({
              width: node.clientWidth,
              height: node.clientHeight,
            });
          }
        });
      });
    };
    const debouncedHandleResize = debounce(handleResize, 100);

    handleResize();

    window.addEventListener('resize', debouncedHandleResize);
    window.addEventListener('orientationchange', debouncedHandleResize);

    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
      window.removeEventListener('orientationchange', debouncedHandleResize);
    };
  }, [node]);

  return [ref, size, node];
};



// export const useDimensions = (myRef) => {
//   const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

//   useEffect(() => {
//     const getDimensions = () => ({
//       width: myRef.current?.offsetWidth,
//       height: myRef.current?.offsetHeight,
//     });

//     const handleResize = () => {
//       setDimensions(getDimensions());
//     };

//     if (myRef.current) {
//       setDimensions(getDimensions());
//     }

//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, [myRef]);

//   return dimensions;
// };
