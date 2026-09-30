# Skin Segmentation

This project finds the skin in an image and makes a mask of it. It was a university project for the Image and Video Processing course.

This project is based on [samhaswon/skin_segmentation](https://github.com/samhaswon/skin_segmentation) (GPL-3.0).

## Methods

- **U²-Net** (`u2net/`): A neural network finds the skin. This method gives the best results.
- **Traditional** (`traditional/`): HSV color thresholds find the skin.
  - `hsv_range.py`: You set the thresholds manually with sliders.
  - `face_skin.py`: The script finds a face and calculates the thresholds from it.

## Web client

The web client (`web_client/`, SvelteKit) lets you upload an image and see the mask. The server sends the image to the U²-Net Python process.

## Setup

1. Download the ONNX models from the [upstream releases](https://github.com/samhaswon/skin_segmentation/releases).
2. Set the model paths in `u2net/main.py`.
3. Set the path to `u2net/main.py` in `web_client/src/lib/pythonProcess.ts`.
4. Make a virtual environment and install the Python packages:
   `python3 -m venv u2net/venv && u2net/venv/bin/pip install -r u2net/requirements.txt`.
5. Install the web client packages: `cd web_client && npm install`.
6. Start the project: `./run.sh`.
