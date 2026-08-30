
fetch('data/buku.json')
.then(r=>r.json())
.then(books=>{
 const box=document.getElementById('kabayanBookGrid');
 if(!box) return;

 box.innerHTML=books.map(book=>`
 <article class="book-card">
   <img src="${book.cover}" alt="${book.title}">
   <div class="book-category">${book.category}</div>
   <h3>${book.title}</h3>
   <a href="${book.link}">Baca selengkapnya →</a>
 </article>
 `).join('');
});
