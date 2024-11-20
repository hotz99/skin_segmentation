<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Slider } from "$lib/components/ui/slider";
  import * as Tabs from "$lib/components/ui/tabs";
  import { LoaderCircle } from "lucide-svelte";

  import ManualHsvProcessor from "$lib/components/manualHsvProcessor.svelte";

  type ProcessingMode = "naive" | "machineLearning";
  let processingMode: ProcessingMode = $state("naive");
  let processing: boolean = $state(false);

  const ENDPOINT = "/api/upload";

  let selectedFile: File | null = $state(null);

  let inputImageUrl: string | null = $state(null);
  let inputImageElement: HTMLImageElement | null = $state(null);
  let onLoadInputImageUrl: string | null = $state(null);

  let processedImageUrl: string | null = $state(null);
  let onLoadProcessedImageUrl: string | null = $state(null);
  let processedImageCanvasElement: HTMLCanvasElement | null = $state(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!selectedFile) {
      alert("Select an image file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    processing = true;

    const response = await fetch(ENDPOINT, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const blob = await response.blob();
      processedImageUrl = URL.createObjectURL(blob);
    } else {
      console.error("failed to process image: ", response);
    }

    processing = false;
  }

  function handleFileChange(event) {
    selectedFile = event.target.files[0];

    if (!selectedFile) return;

    inputImageElement = new Image();

    if (!inputImageElement) {
      console.log("no inputImageElement");
      return;
    }

    const inputImageUrl = URL.createObjectURL(selectedFile);
    inputImageElement.src = inputImageUrl;

    inputImageElement.onload = () => {
      processedImageCanvasElement.width = inputImageElement.naturalWidth;
      processedImageCanvasElement.height = inputImageElement.naturalHeight;
      onLoadInputImageUrl = inputImageUrl;
    };
  }
</script>

<div class="flex items-center justify-center h-full w-full mt-24 space-x-10">
  <div class="flex flex-col space-y-4 items-center">
    <input type="file" accept="image/*" onchange={handleFileChange} />
    <Tabs.Root class="mx-auto" bind:value={processingMode}>
      <Tabs.List class="flex space-x-4">
        <Tabs.Trigger value="naive" class="py-2 px-4">Naive</Tabs.Trigger>
        <Tabs.Trigger value="machineLearning" class="py-2 px-4"
          >Machine Learning</Tabs.Trigger
        >
      </Tabs.List>
    </Tabs.Root>
    {#if processingMode === "naive"}
      <div class="flex flex-row space-x-16 p-8 border-2 rounded">
        <div class="flex flex-col space-y-8 w-1/4 min-w-[200px]">
          <ManualHsvProcessor
            inputImageUrl={onLoadInputImageUrl}
            {inputImageElement}
            {processedImageCanvasElement}
          />
        </div>
        <div class="flex flex-col space-y-4 items-center border rounded">
          <canvas bind:this={processedImageCanvasElement}></canvas>
          <h2>Processed Image</h2>
        </div>
      </div>
    {/if}
    <div class="flex flex-col space-y-4 items-center flex-grow">
      {#if processingMode === "machineLearning"}
        <form onsubmit={handleSubmit}>
          <Button type="submit" class="mt-6" disabled={!selectedFile}>
            {#if processing}
              <svg
                class="animate-spin m-8 w-full h-full text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <LoaderCircle />
              </svg>
            {:else}
              Upload and Process Image
            {/if}
          </Button>
        </form>
        <div class="flex flex-row space-x-4 max-w-1/3">
          {#if inputImageUrl}
            <div class="flex flex-col space-y-4 items-center">
              <img
                src={inputImageUrl}
                alt="Input Image Alt"
                bind:this={inputImageElement}
              />
              <h2>Input Image</h2>
            </div>
          {/if}
          {#if processedImageUrl}
            <div class="flex flex-col space-y-4 items-center">
              <img src={processedImageUrl} alt="Processed Image Alt" />
              <h2>Processed Image</h2>
            </div>
          {/if}
        </div>
      {/if}
      <div class="flex flex-row space-x-4"></div>
    </div>
  </div>
</div>
