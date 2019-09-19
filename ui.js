'use strict';
const React = require('react');
const {useState} = require('react');
const PropTypes = require('prop-types');
const {Box, Text, Color} = require('ink');
const useInterval = require('./useInterval')

const FIELD_SIZE = 16
const FIELD_ROW =[...new Array(FIELD_SIZE).keys()]
const DIRECTION = {
  TOP: {x: 0, y: 1},
  RIGHT: {x: 1, y: 0},
  BOTTOM: {x: 0, y: -1},
  LEFT: {x: -1, y: 0}
}

const foodItem = {
  x: Math.floor(Math.random() * FIELD_SIZE),
  y: Math.floor(Math.random() * FIELD_SIZE)
}

const App = () => {
  const [snakeSegments, setSnakeSegments] = useState([
    {x: 8, y: 8},
    {x: 7, y: 8},
    {x: 6, y: 8}
  ]);
  const [direction, setDirection] = useState(DIRECTION.RIGHT);

  useInterval(() => {
    setSnakeSegments(segments => getNewSnakePosition(segments, direction))
  }, 200)

  return (
    <Box flexDirection="column" alignItems="center">
      <Text>
        <Color green>Snake</Color> game
      </Text>
      <Box flexDirection="column">
        {FIELD_ROW.map(y => (
          <Box key={y}>
            {FIELD_ROW.map(x => (
              <Box key={x} alignItems="center">{getItem(x, y, snakeSegments) || ' · '}</Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  )
};

function getItem(x, y, snakeSegments) {
  if (foodItem.x === x && foodItem.y === y) {
    return <Color red> 🍅</Color>
  }

  for (const segment of snakeSegments) {
    if (segment.x === x && segment.y === y) {
      return <Color green> ■ </Color>
    }
  }
}

function getNewSnakePosition(snakeSegments, direction) {
  const [head] = snakeSegments
  const newHead = {
    x: limitByField(head.x + direction.x),
    y: limitByField(head.y + direction.y)
  }

  return [newHead, ...snakeSegments.slice(0, -1)]
}

function limitByField(j) {
  if (j >= FIELD_SIZE) {
    return 0
  }

  if (j < 0) {
    return FIELD_SIZE - 1
  }

  return j
}

App.propTypes = {
	name: PropTypes.string
};

App.defaultProps = {
	name: 'Stranger'
};

module.exports = App;
