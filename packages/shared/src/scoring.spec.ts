import { describe, it, expect } from 'vitest';
import { calculatePerformanceScore } from './index';

describe('Scoring Logic — Spécification v1.0 Section 4.3', () => {
  const perfMax = 50;
  const tOpt = 100; // ms
  const tMax = 500; // ms

  it('attribue le score maximum si le temps mesuré est inférieur ou égal à t_opt', () => {
    const score = calculatePerformanceScore(80, tOpt, tMax, perfMax);
    expect(score).toBe(perfMax);
  });

  it('applique la tolérance de 5% autour de t_opt', () => {
    // 100 * 1.05 = 105ms -> doit accorder le score max grâce à la tolérance
    const score = calculatePerformanceScore(104, tOpt, tMax, perfMax);
    expect(score).toBe(perfMax);
  });

  it('attribue 0 point de performance si le temps mesuré dépasse t_max', () => {
    const score = calculatePerformanceScore(600, tOpt, tMax, perfMax);
    expect(score).toBe(0);
  });

  it('calcule une décroissance linéaire entre t_opt et t_max', () => {
    // Milieu : 300 ms -> ratio (300-100)/(500-100) = 200/400 = 0.5 -> score = 25
    const score = calculatePerformanceScore(300, tOpt, tMax, perfMax);
    expect(score).toBe(25);
  });
});
