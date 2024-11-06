// src/routes/api/upload/+server.ts
import getPythonProcess from "$lib/pythonProcess";
import fs from "fs";
import path from "path";
import type { RequestHandler } from "@sveltejs/kit";

const pythonProcess = getPythonProcess();

pythonProcess.stderr.on("data", (data) => {
  console.error("python stderr:", data.toString());
});

console.log("python process started");

function processImageWithPython(imagePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stdinStream = pythonProcess.stdin;

    stdinStream.write(imagePath + "\n", (err) => {
      if (err) {
        reject("error writing to python stdin: " + err);
        return;
      }
    });

    pythonProcess.stdout.once("data", (data) => {
      const outputPath = data.toString().trim();
      resolve(outputPath);
    });

    pythonProcess.stderr.once("data", (error) => {
      console.log(error.toString());
      //reject("error processing image with python: " + error.toString());
    });
  });
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.formData();
    const file = data.get("file");

    if (!file || !(file instanceof File)) {
      console.error("no file or incorrect type received:", file);
      return new Response("no file uploaded or incorrect file type", { status: 400 });
    }

    console.log("received file:", file.name);

    const tempInputPath = `/tmp/input_image_${Date.now()}.jpg`;

    const buffer = Buffer.from(await file.arrayBuffer());

    fs.writeFileSync(tempInputPath, buffer);
    console.log(`input file written to: ${tempInputPath}`);

    const tempOutputPath = await processImageWithPython(tempInputPath);
    console.log(`python finished processing image: ${tempOutputPath}`);

    const outputImageBuffer = fs.readFileSync(tempOutputPath);
    const outputImage = new Uint8Array(outputImageBuffer).buffer;

    // delete temp files
    fs.unlinkSync(tempInputPath);
    fs.unlinkSync(tempOutputPath);

    return new Response(outputImage, {
      headers: {
        "Content-Type": "image/jpg",
      },
    });

  } catch (e) {
    console.error(e);
    return new Response("error processing image", { status: 500 });
  }
};
