#!/usr/bin/env node
'use strict';

/**
 * Supported operations:
 * - addition
 * - subtraction
 * - multiplication
 * - division
 * - modulo
 * - power
 * - square root
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
  modulo: {
    label: 'modulo',
    symbol: '%',
    compute: (left, right) => modulo(left, right),
  },
  power: {
    label: 'power',
    symbol: '^',
    compute: (left, right) => power(left, right),
  },
  squareRoot: {
    label: 'square root',
    symbol: 'sqrt',
    compute: (value) => squareRoot(value),
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
  '%': 'modulo',
  modulo: 'modulo',
  mod: 'modulo',
  '^': 'power',
  power: 'power',
  pow: 'power',
  sqrt: 'squareRoot',
  'square-root': 'squareRoot',
  squareroot: 'squareRoot',
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

function modulo(a, b) {
  if (b === 0) {
    throw new Error('Cannot modulo by zero.');
  }

  return a % b;
}

function power(base, exponent) {
  return base ** exponent;
}

function squareRoot(n) {
  if (n < 0) {
    throw new Error('Cannot take the square root of a negative number.');
  }

  return Math.sqrt(n);
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
    '  node src/calculator.js <operation> <operand> [rightOperand]',
    '',
    'Operations:',
    '  add (+)        addition',
    '  subtract (-)   subtraction',
    '  multiply (*)   multiplication',
    '  divide (/)     division',
    '  modulo (%)     remainder after division',
    '  power (^)      exponentiation',
    '  squareRoot     square root (unary)',
  ].join('\n'));
}

function run(argv = process.argv.slice(2)) {
  const [rawOperation, rawLeftOperand, rawRightOperand] = argv;

  if (rawOperation === '--help' || rawOperation === '-h') {
    printUsage();
    return 0;
  }

  if (!rawOperation || rawLeftOperand === undefined) {
    printUsage();
    return 1;
  }

  const operationName = normalizeOperation(rawOperation);

  if (!operationName) {
    throw new Error(`Unknown operation: "${rawOperation}"`);
  }

  const leftOperand = parseNumber(rawLeftOperand, 'first operand');
  const rightOperand = rawRightOperand === undefined
    ? undefined
    : parseNumber(rawRightOperand, 'second operand');
  if (rightOperand === undefined && operationName !== 'squareRoot') {
    printUsage();
    return 1;
  }

  const result = calculate(operationName, leftOperand, rightOperand);
  const { symbol } = OPERATIONS[operationName];

  if (operationName === 'squareRoot') {
    console.log(`${symbol}(${leftOperand}) = ${result}`);
    return 0;
  }

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
  modulo,
  normalizeOperation,
  parseNumber,
  power,
  squareRoot,
  run,
};
