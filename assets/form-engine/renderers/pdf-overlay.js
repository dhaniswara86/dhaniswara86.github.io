
/*
 PDF Overlay Renderer - Pilot
 Menempatkan field berdasarkan koordinat JSON.
*/

function renderPdfOverlay(schema){
  root.innerHTML = "";

  const page = document.createElement("div");
  page.className = "pdf-overlay-page";

  (schema.fields || []).forEach(field => {
    const wrap = document.createElement("div");
    wrap.className = "overlay-field";
    wrap.style.left = field.x;
    wrap.style.top = field.y;
    wrap.style.width = field.width || "auto";

    if(field.type === "checkbox"){
      wrap.innerHTML = `<input type="checkbox" id="${field.id}">`;
    } else if(field.type === "textarea"){
      wrap.innerHTML = `<textarea id="${field.id}"></textarea>`;
    } else {
      wrap.innerHTML = `<input type="text" id="${field.id}" aria-label="${field.label || ''}">`;
    }

    page.appendChild(wrap);
  });

  root.appendChild(page);
}
