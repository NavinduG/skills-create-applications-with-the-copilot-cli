const assert = require('node:assert/strict');

const {
  OPERATIONS,
  calculate,
  normalizeOperation,
  parseNumber,
  run,
} = require('../calculator');

describe('calculator', () => {
  describe('OPERATIONS', () => {
    it('lists the supported basic operations', () => {
      assert.deepEqual(Object.keys(OPERATIONS).sort(), ['add', 'divide', 'multiply', 'subtract']);
    });
  });

  describe('normalizeOperation', () => {
    it('normalizes aliases for addition', () => {
      assert.equal(normalizeOperation('add'), 'add');
      assert.equal(normalizeOperation('+'), 'add');
    });

    it('normalizes aliases for subtraction, multiplication, and division', () => {
      assert.equal(normalizeOperation('subtract'), 'subtract');
      assert.equal(normalizeOperation('-'), 'subtract');
      assert.equal(normalizeOperation('multiply'), 'multiply');
      assert.equal(normalizeOperation('*'), 'multiply');
      assert.equal(normalizeOperation('x'), 'multiply');
      assert.equal(normalizeOperation('divide'), 'divide');
      assert.equal(normalizeOperation('/'), 'divide');
    });

    it('returns null for unsupported values', () => {
      assert.equal(normalizeOperation('power'), null);
      assert.equal(normalizeOperation(undefined), null);
    });
  });

  describe('parseNumber', () => {
    it('parses valid numeric input', () => {
      assert.equal(parseNumber('12.5', 'operand'), 12.5);
      assert.equal(parseNumber(7, 'operand'), 7);
    });

    it('rejects invalid numbers', () => {
      assert.throws(() => parseNumber('abc', 'operand'), /Invalid operand/);
    });
  });

  describe('calculate', () => {
    it('adds numbers', () => {
      assert.equal(calculate('add', 2, 3), 5);
    });

    it('subtracts numbers', () => {
      assert.equal(calculate('subtract', 10, 4), 6);
    });

    it('multiplies numbers', () => {
      assert.equal(calculate('multiply', 45, 2), 90);
    });

    it('divides numbers', () => {
      assert.equal(calculate('divide', 20, 5), 4);
    });

    it('rejects division by zero', () => {
      assert.throws(() => calculate('divide', 10, 0), /Cannot divide by zero/);
    });

    it('rejects unsupported operations', () => {
      assert.throws(() => calculate('power', 2, 3), /Unsupported operation/);
    });
  });

  describe('run', () => {
    let originalLog;
    let originalError;

    beforeEach(() => {
      originalLog = console.log;
      originalError = console.error;
    });

    afterEach(() => {
      console.log = originalLog;
      console.error = originalError;
    });

    it('runs the image examples with basic operations', () => {
      const output = [];
      console.log = (message) => output.push(message);

      assert.equal(run(['add', '2', '3']), 0);
      assert.equal(run(['subtract', '10', '4']), 0);
      assert.equal(run(['multiply', '45', '2']), 0);
      assert.equal(run(['divide', '20', '5']), 0);

      assert.deepEqual(output, [
        '2 + 3 = 5',
        '10 - 4 = 6',
        '45 * 2 = 90',
        '20 / 5 = 4',
      ]);
    });

    it('returns a non-zero code and prints help when arguments are missing', () => {
      const output = [];
      console.log = (message) => output.push(message);

      assert.equal(run([]), 1);
      assert.match(output.join('\n'), /Usage:/);
    });

    it('prints help for --help', () => {
      const output = [];
      console.log = (message) => output.push(message);

      assert.equal(run(['--help']), 0);
      assert.match(output.join('\n'), /Operations:/);
    });
  });
});
