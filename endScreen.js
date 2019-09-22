'use strict';
const React = require('react');
const {Color, Box} = require('ink');

module.exports = function({size}) {
  return (
    <Box flexDirection="column"
         width={size}
         height={size}
         alignItems="center"
         justifyContent="center"
    >
      <Color red>You died</Color>
    </Box>
  )
}
