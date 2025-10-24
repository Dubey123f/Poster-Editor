# 🧩 Editable HTML Poster  
### Frontend Engineer Evaluation Task

## 🚀 Overview  
**Editable HTML Poster** is a web-based visual HTML editor built with **Next.js (App Router)** and **TypeScript**.  
It enables users to **import, edit, and export** HTML files within a **fixed 720×720 design canvas** — allowing intuitive manipulation of text, images, and layouts directly on screen.

This project demonstrates **frontend engineering principles**, including **modular architecture (SOLID)**, **real-time DOM manipulation**, and **state-driven interactivity**, all while maintaining **clean design and export fidelity**.

---

## ⚙️ Tech Stack  
- **Framework:** Next.js (App Router)  
- **Language:** TypeScript  
- **Styling:** Tailwind CSS  
- **Architecture:** SOLID principles  
- **Dependencies:**  
  - `react-draggable` / `dnd-kit` → for drag & drop  
  - `dompurify` → for HTML sanitization  
  - Minimal dependencies for better performance  

---

## 🎯 Features  

### 🗂️ Import HTML  
- Upload or paste `.html` files  
- Safe rendering using DOM sanitization  
- Isolated stage rendering (prevents global style leakage)

### 🧱 Canvas Stage  
- Fixed 720×720 pixel workspace  
- Displays imported content accurately  
- Optional zoom and pan  
- Prevents overflow beyond boundaries  

### ✏️ Element Editing  
- **Select Elements**: Highlight selected node with border  
- **Text Editing**: Inline or via property panel (font, size, color, weight)  
- **Image Editing**: Replace `src`, `alt`, `width`, and `height` dynamically  
- **Draggable Movement**: Reposition elements via drag & drop  
- **Deletion**: Remove elements (via button or keyboard shortcut)  

### ➕ Add New Elements  
- Add new text blocks (`<p>` / `<div>`) or images (`<img>`)  
- Elements are fully editable and draggable  
- Default placeholder styling for new items  

### 💾 Export HTML  
- Serialize modified DOM and export as `.html`  
- Preserves design fidelity and structure  
- Includes metadata tag:  
  ```html
  <meta data-generated-by="editable-html-poster" />