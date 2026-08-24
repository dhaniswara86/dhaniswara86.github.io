const form = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const statusEl = document.getElementById("status");

function setStatus(message, kind = "") {
  statusEl.textContent = message || "";
  statusEl.className = `form-status ${kind}`.trim();
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  setStatus("Memeriksa akun...");

  const email = form.email.value.trim();
  const password = form.password.value;

  const { error } = await window.kabayanSupabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    setStatus(error.message, "error");
    return;
  }

  location.replace("ruang-belajar.html");
});

signupForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  setStatus("Membuat akun...");

  const full_name = signupForm.full_name.value.trim();
  const email = signupForm.email.value.trim();
  const password = signupForm.password.value;

  const { data, error } = await window.kabayanSupabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name }
    }
  });

  if (error) {
    setStatus(error.message, "error");
    return;
  }

  if (data.session) {
    location.replace("ruang-belajar.html");
    return;
  }

  setStatus(
    "Akun berhasil dibuat. Jika konfirmasi email aktif, periksa email Anda sebelum login.",
    "success"
  );
});
