document.getElementById('fetch-btn').addEventListener('click', async () => {
  const url = document.getElementById('url-input').value.trim();
  const output = document.getElementById('output');

  if (!url) {
    output.innerText = "Please enter a URL.";
    return;
  }

  output.innerHTML = "<p>Loading...</p>";

  try {
    // Correct Render URL
    const response = await fetch(`https://project-folder-5hxu.onrender.com/fetch-html?url=${encodeURIComponent(url)}`);
    
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const html = await response.text();

    // Parse the full HTML page
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Remove unwanted elements
    doc.querySelectorAll('script, style, img, iframe, svg, link, picture, noscript, header, footer, nav, aside, form, button').forEach(el => el.remove());

    // Replace <a> with <span> to keep text but remove links
    doc.querySelectorAll('a').forEach(a => {
      const span = document.createElement('span');
      span.innerHTML = a.innerHTML;
      a.replaceWith(span);
    });

    // Use main content if available
    const main = doc.querySelector('main') || doc.body;

    // Filter for meaningful content
    const elements = Array.from(main.querySelectorAll('p, h1, h2, h3, li, blockquote'))
      .filter(el => el.innerText.trim().length > 50);

    const cleanHTML = elements
      .map(el => `<${el.tagName.toLowerCase()}>${el.innerText.trim()}</${el.tagName.toLowerCase()}>`)
      .join('\n');

    output.innerHTML = cleanHTML || "<p>Couldn't extract readable content.</p>";
  } catch (err) {
    console.error(err);
    output.innerHTML = "<p>Failed to fetch or parse article.</p>";
  }
});
