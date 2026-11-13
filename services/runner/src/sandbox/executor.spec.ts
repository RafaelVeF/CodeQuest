import { describe, it, expect } from 'vitest';
import { executeInSandbox } from './executor';
import { ExecutionJobData } from '@codequest/shared';

describe('Runner Sandbox Executor', () => {
  it('exécute exactement 5 runs et calcule la médiane CPU', async () => {
    const jobData: ExecutionJobData = {
      submissionId: 'sub-test-01',
      challengeId: 'chal-01',
      userId: 'user-01',
      language: 'python',
      code: 'def tri(l): return sorted(l)',
      tests: [
        { id: 't1', input: '[3, 1, 2]', expectedOutput: '[1, 2, 3]', isHidden: false },
        { id: 't2', input: '[]', expectedOutput: '[]', isHidden: true },
      ],
      cpuLimitMs: 500,
      memoryLimitMb: 128,
      nbRuns: 5,
    };

    const result = await executeInSandbox(jobData);

    expect(result.success).toBe(true);
    expect(result.runs.length).toBe(5);
    expect(result.medianCpuTimeMs).toBeGreaterThan(0);
    expect(result.allTestsPassed).toBe(true);
  });
});

