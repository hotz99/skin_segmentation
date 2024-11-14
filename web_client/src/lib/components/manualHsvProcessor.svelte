<script lang="ts">
  import { onMount } from "svelte";
  import { Slider } from "$lib/components/ui/slider";

  const OPENCV_SRC = "https://docs.opencv.org/4.1.0/opencv.js";

  // expose prop to load externally
  // https://svelte.dev/docs/svelte/$props
  let { inputImageElement } = $props();

  let isOpenCVLoaded = $state(false);

  // number[] bc `Slider` bind expects an array
  // doubles bc opencv.js expects doubles
  let hueMin = $state([0.0]),
    hueMax = $state([255.0]),
    saturationMin = $state([0.0]),
    saturationMax = $state([255.0]),
    valueMin = $state([0.0]),
    valueMax = $state([255.0]);

  // number[] bc `Slider` bind expects an array
  // doubles bc opencv.js expects doubles
  let rScalar = $state([0.0]),
    gScalar = $state([0.0]),
    bScalar = $state([0.0]);

  function loadOpenCV() {
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = OPENCV_SRC;
      script.async = true;
      script.onload = () => {
        cv["onRuntimeInitialized"] = () => {
          isOpenCVLoaded = true;
          console.log("loaded opencv.js");
          resolve();
        };
      };
      script.onerror = () => reject(new Error("failed to load opencv.js"));
      document.head.appendChild(script);
    });
  }

  onMount(async () => {
    try {
      await loadOpenCV();
      isOpenCVLoaded = true;
    } catch (error) {
      console.error("failed to load opencv.js: ", error);
    }
  });

  $effect(() => {
    // reached
    console.log(
      "inputImageElement naturalWidth: ",
      inputImageElement.naturalWidth,
    );
    console.log(
      "inputImageElement naturalHeight: ",
      inputImageElement.naturalHeight,
    );

    if (!isOpenCVLoaded || !inputImageElement) return;
    if (inputImageElement.naturalWidth == 0) return;

    // not reached
    console.log(
      "inputImageElement naturalWidth: ",
      inputImageElement.naturalWidth,
    );
    console.log(
      "inputImageElement naturalHeight: ",
      inputImageElement.naturalHeight,
    );

    console.log("effect inputImageElement: ", inputImageElement);
    processImage();
    console.log("processed image");
  });

  function processImage() {
    console.log("processing image");

    const inputMat = cv.imread(inputImageElement);

    console.log(
      "inputMat has size ",
      inputMat.size().width,
      "x",
      inputMat.size().height,
    );

    // Mat() params: nRows, nCols, matType, Scalar(rDouble, gDouble, bDouble)
    const scalarMat = new cv.Mat(
      inputMat.size().height,
      inputMat.size().width,
      inputMat.type(),
      new cv.Scalar(rScalar[0], gScalar[0], bScalar[0]),
    );

    const adjustedMat = new cv.Mat();
    cv.subtract(inputMat, scalarMat, adjustedMat);

    //cv.imshow(canvasElement, adjustedMat);

    const hsvMat = new cv.Mat();
    cv.cvtColor(adjustedMat, hsvMat, cv.COLOR_BGR2HSV);
    const lowerHSV = new cv.Mat(
      hsvMat.size().height,
      hsvMat.size().width,
      hsvMat.type(),
      new cv.Scalar(hueMin[0], saturationMin[0], valueMin[0]),
    );
    const upperHSV = new cv.Mat(
      hsvMat.size().height,
      hsvMat.size().width,
      hsvMat.type(),
      new cv.Scalar(hueMax[0], saturationMax[0], valueMax[0]),
    );

    const skinMask = new cv.Mat();

    cv.inRange(hsvMat, lowerHSV, upperHSV, skinMask);

    const result = new cv.Mat();
    cv.bitwise_and(inputMat, inputMat, result, skinMask);

    const canvasElement = document.getElementById(
      "outputCanvas",
    ) as HTMLCanvasElement;

    cv.imshow(canvasElement, result);

    // free allocations
    inputMat.delete();
    scalarMat.delete();
    adjustedMat.delete();
    hsvMat.delete();
    lowerHSV.delete();
    upperHSV.delete();
    skinMask.delete();
    result.delete();
  }
</script>

<div class="flex flex-col space-y-4">
  <label>Hue Min: <Slider bind:value={hueMin} max={255} step={1} /> </label>
  <label> Hue Max: <Slider bind:value={hueMax} max={255} step={1} /> </label>
  <label>
    Saturation Min: <Slider bind:value={saturationMin} max={255} step={1} />
  </label>
  <label>
    Saturation Max: <Slider bind:value={saturationMax} max={255} step={1} />
  </label>
  <label>
    Value Min: <Slider bind:value={valueMin} max={255} step={1} />
  </label>
  <label>
    Value Max: <Slider bind:value={valueMax} max={255} step={1} />
  </label>
  <label> R: <Slider bind:value={rScalar} max={255} step={1} /> </label>
  <label> G: <Slider bind:value={gScalar} max={255} step={1} /> </label>
  <label> B: <Slider bind:value={bScalar} max={255} step={1} /> </label>
</div>
