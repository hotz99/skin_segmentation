<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Slider } from "$lib/components/ui/slider";
  import * as Tabs from "$lib/components/ui/tabs";
  import { LoaderCircle } from "lucide-svelte";

  import ManualHsvProcessor from "$lib/components/manualHsvProcessor.svelte";

  type ProcessingMode = "naive" | "machineLearning";
  let processingMode: ProcessingMode = $state("naive");

  const ENDPOINT = "/api/upload";
  let selectedFile: File | null = $state(null);
  let inputImageElement: HTMLImageElement | null = $state(null);
  let inputImageUrl: string = $state("");
  let processing = $state(false);
  let processedImageUrl: string = $state("");

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
    inputImageUrl = URL.createObjectURL(selectedFile);
    processedImageUrl = "";
    console.log("selected file name: ", selectedFile.name);
  }
</script>

<div class="flex items-center justify-center h-full w-full mt-24 space-x-10">
  <div class="flex flex-col space-y-4">
    <Tabs.Root class="mx-auto" bind:value={processingMode}>
      <Tabs.List class="flex space-x-4">
        <Tabs.Trigger value="naive" class="py-2 px-4">Naive</Tabs.Trigger>
        <Tabs.Trigger value="machineLearning" class="py-2 px-4"
          >Machine Learning</Tabs.Trigger
        >
      </Tabs.List>
    </Tabs.Root>
    <div class="flex flex-row space-x-16 p-8 border-2 rounded border-white">
      {#if processingMode === "naive"}
        {#key inputImageUrl}
          <div class="flex flex-col space-y-8 w-1/4 min-w-[200px]">
            <ManualHsvProcessor {inputImageElement} />
          </div>
        {/key}
      {/if}
      <div class="flex flex-col space-y-4 items-center flex-grow">
        <input type="file" accept="image/*" onchange={handleFileChange} />
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
        {/if}
        <div class="flex flex-row space-x-4 mt-4">
          <div
            class="flex flex-col items-center max-w-[80vh] max-h-[80vh] overflow-hidden"
          >
            {#if inputImageUrl}
              <img
                src={inputImageUrl}
                alt="Input Image"
                bind:this={inputImageElement}
                class="w-full h-auto object-contain"
              />
              <h2>Input Image</h2>
            {/if}
          </div>
          <div
            class="flex flex-col items-center max-w-[80vh] max-h-[80vh] overflow-hidden"
          >
            {#if processedImageUrl && processingMode === "machineLearning"}
              <img src={processedImageUrl} alt="Processed Image" />
              <h2>Processed Image</h2>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
