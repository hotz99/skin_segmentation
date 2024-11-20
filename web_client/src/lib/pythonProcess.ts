import { spawn, ChildProcessWithoutNullStreams } from "child_process";

let pythonProcess: ChildProcessWithoutNullStreams | null = null;

function getPythonProcess() {
  if (!pythonProcess) {
    // TODO make path relative/dynamic
    pythonProcess = spawn("python", ["/home/pedro/uni/year_2/ivp/project/skin_segmentation/u2net/main.py"], {
      stdio: ["pipe", "pipe", "pipe"]
    });
  }

  return pythonProcess;
}

export default getPythonProcess;
