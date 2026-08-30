
const id = new URLSearchParams(location.search).get("id");

fetch("data/buku.json")
.then(r=>r.json())
.then(books=>{
 const book = books.find(x=>x.id===id);
 const el=document.getElementById("bookDetail");

 if(!book){
   el.innerHTML="<p>Buku tidak ditemukan.</p>";
   return;
 }

 el.innerHTML=`
 <section class="book-detail-card">
   <div>
    <img class="cover" 
     src="${book.cover}" 
     onerror="this.src='assets/img/book-placeholder.webp'"
     alt="${book.judul}">
   </div>

   <div>
    <span class="category">${book.kategori || "Buku Digital"}</span>
    <h1 class="title">${book.judul}</h1>
    <div class="description">
      ${book.deskripsi || "Panduan digital perpajakan Kabayan."}
    </div>

    <div class="action">
      <a href="buku.html">Lihat Buku Lain</a>
    </div>
   </div>
 </section>`;
})
.catch(()=>{
 document.getElementById("bookDetail").innerHTML=
 "<p>Gagal membaca data buku.</p>";
});
