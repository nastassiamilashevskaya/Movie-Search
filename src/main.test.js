import { getKeys } from './Keyboard';
import MovieCard, { testCard } from './MovieCard';

describe('getKeys', () => {
  test('should return list of keys', () => {
    expect(getKeys).toBeDefined();
    expect(getKeys).toBeInstanceOf(Object);
  });
});

describe('testCard', () => {
  test('should return card', () => {
    expect(testCard).toBeDefined();
    expect(testCard).toBeInstanceOf(MovieCard);
  });
});
