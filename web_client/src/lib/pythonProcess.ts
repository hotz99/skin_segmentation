import { spawn, ChildProcessWithoutNullStreams } from "child_process";

let pythonProcess: ChildProcessWithoutNullStreams | null = null;

function getPythonProcess() {
  if (!pythonProcess) {
    pythonProcess = spawn("python", ["/home/pedro/uni/year_2/ivp/skin_segmentation/u2net/main.py"], {
      stdio: ["pipe", "pipe", "pipe"]
    });
  }

  return pythonProcess;
}

export default getPythonProcess;
