document.getElementById("extractBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  const statusEl = document.getElementById("status");
  statusEl.style.display = "block";
  statusEl.style.color = "#10b981";
  statusEl.innerText = "Scanning DOM Matrix...";

  // Prevent injection on internal chrome:// pages which cause the 'invalid' error
  if (!tab.url || tab.url.startsWith("chrome://") || tab.url.startsWith("edge://")) {
    statusEl.style.color = "#f43f5e";
    statusEl.innerText = "Error: Cannot scan internal browser pages.";
    return;
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });

    chrome.tabs.sendMessage(tab.id, { action: "scrape_job" }, (response) => {
      if (chrome.runtime.lastError) {
        statusEl.style.color = "#f43f5e";
        statusEl.innerText = "Connection Failed. Please reload the page.";
        return;
      }

      if (response && response.role) {
        statusEl.innerText = "Data Extracted. Opening Terminal...";
        
        const baseUrl = "http://localhost:5173/interview";
        const params = new URLSearchParams({
          ext_role: response.role || "Technical Role",
          ext_company: response.company || "Unknown Entity"
        });
        
        chrome.tabs.create({ url: `${baseUrl}?${params.toString()}` });
      } else {
        statusEl.style.color = "#f43f5e";
        statusEl.innerText = "No job profile detected on this page.";
      }
    });
  } catch (err) {
    statusEl.style.color = "#f43f5e";
    statusEl.innerText = "Injection Blocked by Browser Security.";
    console.error(err);
  }
});