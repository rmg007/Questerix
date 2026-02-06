import { describe, it, expect, beforeAll } from 'vitest';
import { projectFiles } from 'archunit';
import { extendVitestMatchers } from 'archunit/dist/src/testing/vitest/vitest-adapter';

beforeAll(() => extendVitestMatchers());

describe('Env module layering', () => {
  it('env loader must not be imported by components', async () => {
    const rule = projectFiles()
      .inFolder('src/components/**')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/lib/env.ts');
    await expect(rule).toPassAsync();
  });
});
