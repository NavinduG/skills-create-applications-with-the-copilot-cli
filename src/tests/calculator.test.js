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
      assert.deepEqual(Object.keys(OPERATIONS).sort(), ['add', 'divide', 'modulo', 'multiply', 'power', 'squareRoot', 'subtract']);
    });
  });

  describe('normalizeOperation', () => {
    it('normalizes aliases for addition', () => {
      assert.equal(normalizeOperation('add'), 'add');
      assert.equal(normalizeOperation('+'), 'add');
    });

    it('normalizes aliases for subtraction, multiplication, division, modulo, power, and square root', () => {
      assert.equal(normalizeOperation('subtract'), 'subtract');
      assert.equal(normalizeOperation('-'), 'subtract');
      assert.equal(normalizeOperation('multiply'), 'multiply');
      assert.equal(normalizeOperation('*'), 'multiply');
      assert.equal(normalizeOperation('x'), 'multiply');
      assert.equal(normalizeOperation('divide'), 'divide');
      assert.equal(normalizeOperation('/'), 'divide');
      assert.equal(normalizeOperation('modulo'), 'modulo');
      assert.equal(normalizeOperation('%'), 'modulo');
      assert.equal(normalizeOperation('power'), 'power');
      assert.equal(normalizeOperation('^'), 'power');
      assert.equal(normalizeOperation('squareRoot'), 'squareRoot');
      assert.equal(normalizeOperation('sqrt'), 'squareRoot');
    });

    it('returns null for unsupported values', () => {
      assert.equal(normalizeOperation('cube'), null);
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

    it('calculates modulo', () => {
      assert.equal(calculate('modulo', 20, 6), 2);
    });

    it('calculates power', () => {
      assert.equal(calculate('power', 2, 3), 8);
    });

    it('calculates square root', () => {
      assert.equal(calculate('squareRoot', 9), 3);
    });

    it('rejects division by zero', () => {
      assert.throws(() => calculate('divide', 10, 0), /Cannot divide by zero/);
    });

    it('rejects modulo by zero', () => {
      assert.throws(() => calculate('modulo', 10, 0), /Cannot modulo by zero/);
    });

    it('rejects negative square roots', () => {
      assert.throws(() => calculate('squareRoot', -1), /Cannot take the square root of a negative number/);
    });

    it('rejects unsupported operations', () => {
      assert.throws(() => calculate('cube', 2, 3), /Unsupported operation/);
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

    it('runs the extended operation examples', () => {
      const output = [];
      console.log = (message) => output.push(message);

      assert.equal(run(['%', '5', '2']), 0);
      assert.equal(run(['^', '2', '3']), 0);
      assert.equal(run(['sqrt', '16']), 0);

      assert.deepEqual(output, [
       '5 % 2 = 1',
       '2 ^ 3 = 8',
       'sqrt(16) = 4',
      ]);
    });

    it('rejects square root of negative numbers', () => {
      assert.throws(() => run(['sqrt', '-16']), /Cannot take the square root of a negative number/);
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
