'use strict';
const {useEffect, useRef} = require('react');

module.exports = function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback
  }, [callback]);

  // setup the game interval
  useEffect(() => {
    if (delay) {
      const intervalId = setInterval(tick, delay);
      return () => clearInterval(intervalId)
    }
  }, [delay])

  function tick() {
    savedCallback.current()
  }
}
