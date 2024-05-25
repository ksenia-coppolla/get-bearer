document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bearer-form");
  const resultDiv = document.getElementById("result");
  const submitButton = document.getElementById("submit");
  const tooltipMessage = document.getElementById("tooltip-message");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    submitButton.classList.add("is-loading");
    resultDiv.innerHTML = "";
    resultDiv.classList.remove("success", "error");

    const organizationId = document.getElementById("organization-id").value;
    const environment = document.querySelector(
      'input[name="environment"]:checked'
    ).value;

    try {
      const response = await fetch(`/backend/api/generate-token.js`, {
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
        throw new Error(`Error: ${error.message}`);
      }

      const data = await response.json();
      const result = `<span>Bearer </span><span class="multiline">${data.token}</span>`;

      resultDiv.innerHTML = result;
      resultDiv.classList.add("success");

      submitButton.classList.remove("is-loading");
      navigator.clipboard
        .writeText(data.token)
        .then(() => {
          tooltipMessage.textContent = "Copied!";
          showTooltip();
          console.log("Token copied to clipboard");
        })
        .catch((err) => {
          tooltipMessage.textContent = "Failed to copy!";
          showTooltip();
          console.error("Could not copy token to clipboard", err);
        });
    } catch (error) {
      resultDiv.textContent = error.message;
      resultDiv.classList.add("error");
      submitButton.classList.remove("is-loading");
    }
  });
});

function showTooltip() {
  const tooltip = document.getElementById("tooltip");
  tooltip.classList.add("show");

  setTimeout(() => {
    tooltip.classList.remove("show");
  }, 2000);
}
