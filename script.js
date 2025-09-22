
const pagesContainer = document.getElementById("pagesContainer");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const addBtn = document.getElementById("addBtn");
const descInput = document.getElementById("descInput");
const addImageBtn = document.getElementById("addImageBtn");
const imageInput = document.getElementById("imageInput");
const fontSizeSelect = document.getElementById("fontSizeSelect");
const fontFamilySelect = document.getElementById("fontFamilySelect");
const fontColorInput = document.getElementById("fontColorInput");
const thumbnailsContainer = document.getElementById("thumbnailsContainer");

let currentPageIndex = 0;

function getActivePage() {
  return pagesContainer.children[currentPageIndex];
}

function createThumbnail(pageIndex, imgSrc) {
  const thumb = document.createElement("img");
  thumb.classList.add("thumb-img");
  thumb.src = imgSrc || "";
  thumb.addEventListener("click", () => {
    currentPageIndex = pageIndex;
    showPage(currentPageIndex);
  });
  thumbnailsContainer.appendChild(thumb);
  return thumb;
}

function makeTextDraggable(textEl, pageEl) {
  let isDragging = false;
  let offsetX, offsetY;

  textEl.addEventListener("mousedown", (e) => {
    if(e.target.classList.contains("deleteBtn")) return;
    isDragging = true;
    offsetX = e.clientX - textEl.offsetLeft;
    offsetY = e.clientY - textEl.offsetTop;
    textEl.classList.add("selected");
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      let x = e.clientX - offsetX;
      let y = e.clientY - offsetY;
      const boxRect = pageEl.getBoundingClientRect();
      const textRect = textEl.getBoundingClientRect();
      if (x < 0) x = 0;
      if (y < 0) y = 0;
      if (x + textRect.width > boxRect.width) x = boxRect.width - textRect.width;
      if (y + textRect.height > boxRect.height) y = boxRect.height - textRect.height;
      textEl.style.left = x + "px";
      textEl.style.top = y + "px";
    }
  });

  document.addEventListener("mouseup", () => { isDragging = false; });

  pageEl.addEventListener("click", () => textEl.classList.remove("selected"));

  const deleteBtn = textEl.querySelector(".deleteBtn");
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    textEl.childNodes[0].nodeValue = "";
    textEl.classList.remove("selected");
  });
}

function createNewPage() {
  const page = document.createElement("div");
  page.classList.add("page");

  const img = document.createElement("img");
  img.id = "uploadedImage";
  img.style.display = "none";
  page.appendChild(img);

  const overlayText = document.createElement("div");
  overlayText.classList.add("overlayText");
  overlayText.setAttribute("contenteditable","true");
  overlayText.textContent = "Yaha text ya image show hoga...";
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("deleteBtn");
  deleteBtn.textContent = "❌";
  overlayText.appendChild(deleteBtn);
  page.appendChild(overlayText);

  makeTextDraggable(overlayText, page);

  pagesContainer.appendChild(page);

  createThumbnail(pagesContainer.children.length - 1);

  return page;
}

function showPage(index) {
  Array.from(pagesContainer.children).forEach((page, i) => {
    page.classList.remove("active", "prev");
    if (i === index) page.classList.add("active");
    else if (i === index - 1) page.classList.add("prev");
  });
}

nextBtn.addEventListener("click", () => {
  if (currentPageIndex < pagesContainer.children.length - 1) {
    currentPageIndex++;
  } else {
    createNewPage();
    currentPageIndex++;
  }
  showPage(currentPageIndex);
});

prevBtn.addEventListener("click", () => {
  if (currentPageIndex > 0) {
    currentPageIndex--;
    showPage(currentPageIndex);
  }
});

// Add text
addBtn.addEventListener("click", () => {
  descInput.style.display = "block";
  descInput.focus();
});

descInput.addEventListener("input", () => {
  const overlayText = getActivePage().querySelector(".overlayText");
  if (overlayText) overlayText.childNodes[0].nodeValue = descInput.value || overlayText.childNodes[0].nodeValue;
});

// Font size
fontSizeSelect.addEventListener("change", () => {
  const overlayText = getActivePage().querySelector(".overlayText");
  if (overlayText) overlayText.style.fontSize = fontSizeSelect.value + "px";
});

// Font family
fontFamilySelect.addEventListener("change", () => {
  const overlayText = getActivePage().querySelector(".overlayText");
  if (overlayText) overlayText.style.fontFamily = fontFamilySelect.value;
});

// Font color
fontColorInput.addEventListener("input", () => {
  const overlayText = getActivePage().querySelector(".overlayText");
  if (overlayText) overlayText.style.color = fontColorInput.value;
});

// Image upload
addImageBtn.addEventListener("click", () => imageInput.click());

imageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = getActivePage().querySelector("img#uploadedImage");
      img.src = e.target.result;
      img.style.display = "block";

      // Update thumbnail
      const thumb = thumbnailsContainer.children[currentPageIndex];
      if (thumb) thumb.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Initial thumbnail and make text draggable
createThumbnail(0);
makeTextDraggable(getActivePage().querySelector(".overlayText"), getActivePage());
