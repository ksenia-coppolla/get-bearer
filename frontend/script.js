document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bearer-form");
  const resultDiv = document.getElementById("result");
  const resultWrapper = document.getElementById("result-wrapper");
  const submitButton = document.getElementById("submit");
  const copyButton = document.getElementById("copy");
  let currentBearer = "";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    submitButton.classList.add("is-loading");
    resultDiv.innerHTML = "";
    resultDiv.classList.remove("success", "error");
    resultWrapper.classList.add("is-hidden");

    const organizationId = document.getElementById("organization-id").value;
    const environment = document.querySelector(
      'input[name="environment"]:checked'
    ).value;

    try {
      const response = await fetch(`/api/generate-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organization_id: organizationId,
          environment: environment,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        submitButton.classList.remove("is-loading");
        resultDiv.textContent = error.message;
        resultDiv.classList.add("error");
        resultWrapper.classList.remove("is-hidden");
        throw new Error(`Error: ${error.message}`);
      }

      const data = await response.json();
      currentBearer = data.token;
      const result = `<span>Bearer </span><span class="multiline">${currentBearer}</span>`;

      resultDiv.innerHTML = result;
      resultDiv.classList.add("success");
      resultWrapper.classList.remove("is-hidden");
      submitButton.classList.remove("is-loading");
      copyTextToClipboard(currentBearer);
    } catch (error) {
      resultDiv.textContent = error.message;
      resultDiv.classList.add("error");
      submitButton.classList.remove("is-loading");
    }
  });

  copyButton.addEventListener("click", () => {
    copyTextToClipboard(currentBearer);
  });
});

function copyTextToClipboard(text) {
  if (!text) {
    showTooltip("Nothing to copy!");
    console.log("Nothing to copy");
    return;
  }
  navigator.clipboard
    .writeText(text)
    .then(() => {
      showTooltip("Copied!");
      console.log("Text copied to clipboard");
    })
    .catch((err) => {
      showTooltip("Failed to copy!");
      console.error("Could not copy text to clipboard", err);
    });
}

function showTooltip(message) {
  const tooltip = document.getElementById("tooltip");
  const tooltipMessage = document.getElementById("tooltip-message");
  tooltipMessage.textContent = message;
  tooltip.classList.add("show");

  setTimeout(() => {
    tooltip.classList.remove("show");
  }, 2000);
}
