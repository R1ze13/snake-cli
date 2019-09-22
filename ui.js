'use strict';
const React = require('react');
const {useState, useEffect, useContext} = require('react');
const PropTypes = require('prop-types');
const {Box, Text, Color, StdinContext} = require('ink');
const importJsx = require('import-jsx');
const useInterval = require('./useInterval');
const EndScreen = importJsx('./endScreen');

const ARROW_UP = '\u001B[A';
const ARROW_RIGHT = '\u001B[C';
const ARROW_DOWN = '\u001B[B';
const ARROW_LEFT = '\u001B[D';

const FIELD_SIZE = 16;
const FIELD_ROW =[...new Array(FIELD_SIZE).keys()];
const DIRECTION = {
  TOP: {x: 0, y: -1},
  RIGHT: {x: 1, y: 0},
  BOTTOM: {x: 0, y: 1},
  LEFT: {x: -1, y: 0}
};

let foodItem = {};
setFoodItem();

function App() {
  const [snakeSegments, setSnakeSegments] = useState([
    {x: 8, y: 8},
    {x: 7, y: 8},
    {x: 6, y: 8}
  ]);
  const [direction, setDirection] = useState(DIRECTION.RIGHT);
  const {stdin, setRawMode} = useContext(StdinContext);

  useEffect(() => {
    setRawMode(true);
    stdin.on('data', data => {
      const value = data.toString();

      switch (value) {
        case ARROW_UP: return setDirection(DIRECTION.TOP);
        case ARROW_RIGHT: return setDirection(DIRECTION.RIGHT);
        case ARROW_DOWN: return setDirection(DIRECTION.BOTTOM);
        case ARROW_LEFT: return setDirection(DIRECTION.LEFT);
      }
    });
  }, []);

  const [head, ...tail] = snakeSegments;
  const isIntersectsWithItself = tail.some(segment => segment.x === head.x && segment.y === head.y);

  useInterval(() => {
    setSnakeSegments(segments => getNewSnakePosition(segments, direction))
  }, isIntersectsWithItself ? null : 100);

  return (
    <Box flexDirection="column" alignItems="center">
      <Text>
        <Color green>Snake</Color> game
      </Text>
      {isIntersectsWithItself ? (
        <EndScreen size={FIELD_SIZE} />
      ) : (
        <Box flexDirection="column" marginTop={1}>
          {FIELD_ROW.map(y => (
            <Box key={y}>
              {FIELD_ROW.map(x => (
                <Box key={x} alignItems="center">{getItem(x, y, snakeSegments) || ' · '}</Box>
              ))}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

function getItem(x, y, snakeSegments) {
  if (foodItem.x === x && foodItem.y === y) {
    return <Color red> 🍅 </Color>
  }

  for (const segment of snakeSegments) {
    if (segment.x === x && segment.y === y) {
      return <Color green> ■ </Color>
    }
  }
}

function getNewSnakePosition(snakeSegments, direction) {
  const [head] = snakeSegments;
  const newHead = {
    x: limitByField(head.x + direction.x),
    y: limitByField(head.y + direction.y)
  };

  if (isCollideWithFood(head, foodItem)) {
    setFoodItem();
    return [newHead, ...snakeSegments]
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

function isCollideWithFood(head, foodItem) {
  return head.x === foodItem.x && head.y === foodItem.y
}

function setFoodItem() {
  foodItem = {
    x: Math.floor(Math.random() * FIELD_SIZE),
    y: Math.floor(Math.random() * FIELD_SIZE)
  }
}

App.propTypes = {
  name: PropTypes.string
};

App.defaultProps = {
  name: 'Stranger'
};

module.exports = App;
