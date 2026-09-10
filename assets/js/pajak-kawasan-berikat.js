(() => {
  "use strict";

  const article = document.getElementById("articleBody");
  if (!article) return;

  /* Tabel Markdown dibuat dapat digeser tanpa mengubah isi tabel. */
  article.querySelectorAll("table").forEach((table) => {
    if (table.parentElement?.classList.contains("kb-table-scroll")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "kb-table-scroll";
    wrapper.tabIndex = 0;
    wrapper.setAttribute("role", "region");
    wrapper.setAttribute("aria-label", "Tabel artikel; geser secara horizontal bila diperlukan");
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });

  const normalize = (text) => String(text || "").trim().toLowerCase();
  const headings = [...article.querySelectorAll("h2")];
  const caseStart = headings.find((heading) =>
    heading.id === "10-ilustrasi-kasus" ||
    normalize(heading.textContent).includes("ilustrasi kasus")
  );

  if (!caseStart) return;

  const caseHeadings = [];
  let cursor = caseStart.nextElementSibling;

  while (cursor && cursor.tagName !== "H2") {
    if (cursor.tagName === "H3" && normalize(cursor.textContent).startsWith("kasus")) {
      caseHeadings.push(cursor);
    }
    cursor = cursor.nextElementSibling;
  }

  caseHeadings.forEach((heading, index) => {
    const card = document.createElement("section");
    card.className = "kb-case-card";
    card.classList.toggle("is-open", index === 0);
    heading.parentNode.insertBefore(card, heading);
    card.appendChild(heading);

    const content = document.createElement("div");
    content.className = "kb-case-content";
    content.id = `kb-case-content-${index + 1}`;
    content.hidden = index !== 0;

    let sibling = card.nextElementSibling;
    while (sibling && sibling.tagName !== "H2" && sibling.tagName !== "H3") {
      const next = sibling.nextElementSibling;
      content.appendChild(sibling);
      sibling = next;
    }

    const title = heading.textContent.trim();
    const button = document.createElement("button");
    button.type = "button";
    button.className = "kb-case-toggle";
    button.textContent = title;
    button.setAttribute("aria-controls", content.id);
    button.setAttribute("aria-expanded", String(index === 0));

    heading.textContent = "";
    heading.appendChild(button);
    card.appendChild(content);

    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(open));
      content.hidden = !open;
      card.classList.toggle("is-open", open);
    });
  });
})();
