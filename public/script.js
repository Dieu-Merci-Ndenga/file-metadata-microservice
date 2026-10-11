const form = document.querySelector('#upload-form');
const fileInput = document.querySelector('#upfile');
const fileLabel = document.querySelector('#file-label');
const result = document.querySelector('#result');
const resultState = document.querySelector('#result-state');

fileInput.addEventListener('change', () => {
  fileLabel.textContent = fileInput.files[0]?.name || 'Any format · up to 10 MB';
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  resultState.textContent = 'READING';
  result.textContent = 'Inspecting your file...';

  try {
    const response = await fetch(form.action, { method: 'POST', body: new FormData(form) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Unable to inspect file.');

    resultState.textContent = 'COMPLETE';
    result.innerHTML = `<div class="metadata"><div class="metadata-row"><span class="metadata-label">name</span><span class="metadata-value">${escapeHtml(data.name)}</span></div><div class="metadata-row"><span class="metadata-label">type</span><span class="metadata-value">${escapeHtml(data.type)}</span></div><div class="metadata-row"><span class="metadata-label">size</span><span class="metadata-value">${data.size.toLocaleString()} bytes</span></div></div>`;
  } catch (error) {
    resultState.textContent = 'ERROR';
    result.textContent = error.message;
  }
});

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}