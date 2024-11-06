<script lang="ts">
  const ENDPOINT = "/api/upload";
  let selectedFile: File;
  let processedImageUrl: string;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedFile) {
      alert("Select an image file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    console.log("formData", formData);
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
  }

  function handleFileChange(event) {
    selectedFile = event.target.files[0];
  }
</script>

<form on:submit={handleSubmit}>
  <input type="file" accept="image/*" on:change={handleFileChange} />
  <button type="submit">Upload and Process Image</button>
</form>

{#if processedImageUrl}
  <h2>Processed Image:</h2>
  <img src={processedImageUrl} alt="Processed Image" />
{/if}
