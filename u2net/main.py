import sys
import uuid
from PIL import Image
from session import Session 

WEAKER_MODEL_PATH = "/home/pedro/uni/year_2/ivp/skin_segmentation/u2net/skin_u2netp.onnx"
STRONGER_MODEL_PATH = "/home/pedro/uni/year_2/ivp/skin_segmentation/u2net/skin_u2net.onnx"

session = Session(model_path=STRONGER_MODEL_PATH)

for image_path in sys.stdin:
    image_path = image_path.strip()
    sys.stderr.write("python path: " + image_path + "\n")
    sys.stderr.flush()

    image_in = Image.open(image_path)
    sys.stderr.write("opened image\n")
    processed_image = session.remove(image_in)
    sys.stderr.write("processed image\n")

    if processed_image.mode == "RGBA":
        processed_image = processed_image.convert("RGB")   

    output_path = f"/tmp/{uuid.uuid4()}.jpg"
    processed_image.save(output_path, format="JPEG")
    sys.stderr.write("saved image to " + output_path + "\n")

    sys.stdout.write(output_path + "\n")
    sys.stdout.flush()

# TODO make this work
# for line in sys.stdin:
#     data = json.loads(line)
#     image_path = data["image"]
#
#     image_in = Image.open(image_path)
#     processed_image = session.remove(image_in)
#
#     buffer = BytesIO()
#     # buffered writing bc writing to stream is expensive
#     processed_image.save(buffer, format="PNG")
#
#     # `\n` serves as response delimiter in the stream
#     sys.stdout.buffer.write(buffer.getvalue() + b"\n")
#     sys.stdout.flush()
#
#     import sys


