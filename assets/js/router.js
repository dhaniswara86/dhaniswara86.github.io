document.addEventListener("DOMContentLoaded", async () => {
  try {
    await window.KabayanAuth.requireAuth();
    const profile = await window.KabayanAuth.getMyProfile();

    if (!profile) {
      throw new Error("Profil tidak ditemukan.");
    }

    if (profile.role === "teacher") {
      location.replace("pengajar-dashboard.html");
    } else {
      location.replace("peserta-dashboard.html");
    }
  } catch (err) {
    if (!["AUTH_REQUIRED"].includes(err.message)) {
      document.getElementById("routerStatus").textContent =
        "Gagal membuka ruang belajar: " + err.message;
    }
  }
});
