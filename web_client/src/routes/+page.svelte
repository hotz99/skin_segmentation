<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { LoaderCircle } from "lucide-svelte";

  const ENDPOINT = "/api/upload";
  let selectedFile: File;
  let inputImageUrl: string;
  let processing = false;
  let processedImageUrl: string;

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
  }
</script>

<div class="flex items-center justify-center h-full w-full p-24 space-x-10">
  <div class="flex flex-col space-y-4 items-center">
    <input type="file" accept="image/*" on:change={handleFileChange} />
    <form on:submit={handleSubmit}>
      <Button type="submit" class="mt-6" disabled={!selectedFile}
        >{#if processing}<svg
            class="animate-spin m-8 w-full h-full text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <LoaderCircle />
          </svg>{:else}Upload and Process Image{/if}</Button
      >
    </form>
    <div class="flex flex-row space-x-4">
      <div class="flex flex-col items-center">
        {#if inputImageUrl}
          <img src={inputImageUrl} alt="Input Image" />
          <h2>Input Image</h2>
        {/if}
      </div>
      <div class="flex flex-col items-center">
        {#if processedImageUrl}
          <img src={processedImageUrl} alt="Processed Image" />
          <h2>Processed Image</h2>
        {/if}
      </div>
    </div>
  </div>
</div>
