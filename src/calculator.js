#!/usr/bin/env node
'use strict';

/**
 * Supported operations:
 * - addition
 * - subtraction
 * - multiplication
 * - division
 */
const OPERATIONS = {
  add: {
    label: 'addition',
    symbol: '+',
    compute: (left, right) => left + right,
  },
  subtract: {
    label: 'subtraction',
    symbol: '-',
    compute: (left, right) => left - right,
  },
  multiply: {
    label: 'multiplication',
    symbol: '*',
    compute: (left, right) => left * right,
  },
  divide: {
    label: 'division',
    symbol: '/',
    compute: (left, right) => {
      if (right === 0) {
        throw new Error('Cannot divide by zero.');
      }

      return left / right;
    },
  },
};

const OPERATION_ALIASES = {
  '+': 'add',
  add: 'add',
  '-': 'subtract',
  subtract: 'subtract',
  '*': 'multiply',
  x: 'multiply',
  multiply: 'multiply',
  '/': 'divide',
  divide: 'divide',
};

function normalizeOperation(value) {
  if (typeof value !== 'string') {
    return null;
  }

  return OPERATION_ALIASES[value.trim().toLowerCase()] ?? null;
}

function parseNumber(value, label) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid ${label}: "${value}"`);
  }

  return parsed;
}

function calculate(operationName, leftOperand, rightOperand) {
  const operation = OPERATIONS[operationName];

  if (!operation) {
    throw new Error(`Unsupported operation: "${operationName}"`);
  }

  return operation.compute(leftOperand, rightOperand);
}

function printUsage() {
  console.log([
    'Usage:',
    '  node src/calculator.js <operation> <leftOperand> <rightOperand>',
    '',
    'Operations:',
    '  add (+)        addition',
    '  subtract (-)   subtraction',
    '  multiply (*)   multiplication',
    '  divide (/)     division',
  ].join('\n'));
}

function run(argv = process.argv.slice(2)) {
  const [rawOperation, rawLeftOperand, rawRightOperand] = argv;

  if (rawOperation === '--help' || rawOperation === '-h') {
    printUsage();
    return 0;
  }

  if (!rawOperation || rawLeftOperand === undefined || rawRightOperand === undefined) {
    printUsage();
    return 1;
  }

  const operationName = normalizeOperation(rawOperation);

  if (!operationName) {
    throw new Error(`Unknown operation: "${rawOperation}"`);
  }

  const leftOperand = parseNumber(rawLeftOperand, 'first operand');
  const rightOperand = parseNumber(rawRightOperand, 'second operand');
  const result = calculate(operationName, leftOperand, rightOperand);
  const { symbol } = OPERATIONS[operationName];

  console.log(`${leftOperand} ${symbol} ${rightOperand} = ${result}`);
  return 0;
}

if (require.main === module) {
  try {
    process.exitCode = run();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  OPERATIONS,
  calculate,
  normalizeOperation,
  parseNumber,
  run,
};
