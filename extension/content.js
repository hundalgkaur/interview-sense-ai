chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrape_job") {
    let role = "";
    let company = "";

    try {
      if (window.location.hostname.includes("linkedin.com")) {
        // Broad list of possible LinkedIn Job Title selectors
        const titleSelectors = [
          ".job-details-jobs-unified-top-card__job-title",
          ".jobs-unified-top-card__content--two-pane h2",
          "h1.top-card-layout__title",
          ".jobs-details-top-card__job-title",
          "h2.jobs-details-top-card__job-title",
          "h1" // Last resort h1
        ];

        for (const selector of titleSelectors) {
          const el = document.querySelector(selector);
          if (el && el.innerText.trim()) {
            role = el.innerText.trim();
            break;
          }
        }

        // Broad list of possible LinkedIn Company Name selectors
        const companySelectors = [
          ".job-details-jobs-unified-top-card__company-name",
          ".jobs-unified-top-card__company-name",
          ".topcard__org-name-link",
          ".jobs-details-top-card__company-url",
          ".jobs-details-top-card__company-info a"
        ];

        for (const selector of companySelectors) {
          const el = document.querySelector(selector);
          if (el && el.innerText.trim()) {
            company = el.innerText.trim();
            break;
          }
        }
      } 
      else if (window.location.hostname.includes("indeed.com")) {
        role = document.querySelector("h1.jobsearch-JobInfoHeader-title")?.innerText || 
               document.querySelector(".jobsearch-JobInfoHeader-title span")?.innerText;
        
        company = document.querySelector('div[data-company-name="true"]')?.innerText || 
                  document.querySelector('.jobsearch-JobInfoHeader-subtitle span')?.innerText;
      }

      // Final Generic Fallback if role is still empty
      if (!role) {
        role = document.title.split('|')[0].split('-')[0].trim();
      }
    } catch (e) {
      console.error("Interview Sense Scraper Error:", e);
    }

    sendResponse({ role, company });
  }
  return true;
});