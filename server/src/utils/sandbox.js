import { spawn } from 'child_process';

export function runPythonFile(file) {
  return new Promise((resolve) => {
    const proc = spawn('python3', [file]);
    let stdout = '';
    let stderr = '';

    const timer = setTimeout(() => {
      proc.kill('SIGKILL');
      resolve({
        stdout,
        stderr: stderr + '\nExecution timed out',
        error: true,
      });
    }, 5000);

    proc.stdout.on('data', (d) => (stdout += d.toString()));
    proc.stderr.on('data', (d) => (stderr += d.toString()));

    proc.on('close', (code) => {
      clearTimeout(timer);
      resolve({
        stdout,
        stderr,
        exitCode: code,
        error: code !== 0,
      });
    });
  });
}

export function runCppFile(src, exe) {
  return new Promise((resolve) => {
    const compile = spawn('g++', [src, '-O2', '-std=c++17', '-o', exe]);
    let stderr = '';

    compile.stderr.on('data', (d) => (stderr += d.toString()));

    compile.on('close', (code) => {
      if (code !== 0) {
        return resolve({ stdout: '', stderr, error: true });
      }

      const run = spawn(`./${exe}`);
      let stdout = '';
      let runErr = '';

      const timer = setTimeout(() => {
        run.kill('SIGKILL');
        resolve({
          stdout,
          stderr: runErr + '\nExecution timed out',
          error: true,
        });
      }, 5000);

      run.stdout.on('data', (d) => (stdout += d.toString()));
      run.stderr.on('data', (d) => (runErr += d.toString()));

      run.on('close', (rc) => {
        clearTimeout(timer);
        resolve({
          stdout,
          stderr: runErr,
          exitCode: rc,
          error: rc !== 0,
        });
      });
    });
  });
}

// ✅ wrapper function you tried to import
export async function runCodeInSandbox({ language, code, stdin }) {
  // You need to decide how to execute based on language
  if (language === 'python') {
    return await runPythonFile(code); // here `code` should be file path
  } else if (language === 'cpp') {
    return await runCppFile(code, 'a.out'); // same, `code` should be file path
  } else {
    return { stdout: '', stderr: 'Unsupported language', error: true };
  }
}
