const SUPABASE_URL = "https://ndqwmxshryqpygmupcnj.supabase.co";
const SUPABASE_KEY = "sb_publishable_-BGFKcxGME4yXqX4vRtWpA_g0-Cldkg";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let selected = null;

async function loadEvents() {
    const select = document.getElementById("eventSelect");

    try {
        const { data, error } = await supabaseClient
            .from("external_events")
            .select("id,code,title,event_date")
            .order("event_date", { ascending: false });

        select.innerHTML = "";

        if (error) throw error;

        if (!data || data.length === 0) {
            select.innerHTML = "<option>Tidak ada kegiatan</option>";
            return;
        }

        data.forEach(item => {
            const option = document.createElement("option");
            option.value = item.id;
            option.dataset.code = item.code;
            option.dataset.title = item.title;
            option.textContent = `${item.code} - ${item.title}`;
            select.appendChild(option);
        });

    } catch (err) {
        console.error("Load event error:", err);
        select.innerHTML = "<option>Gagal mengambil kegiatan</option>";
    }
}


async function generateQR() {

    const select = document.getElementById("eventSelect");
    const event = select.options[select.selectedIndex];

    if (!event || !event.value) {
        alert("Pilih kegiatan terlebih dahulu");
        return;
    }

    selected = event;

    const base = location.origin + "/sertifikat-edukasi/";

    const linkAwal = `${base}awal.html?id=${event.value}`;
    const linkAkhir = `${base}akhir.html?id=${event.value}`;

    document.getElementById("link1").value = linkAwal;
    document.getElementById("link2").value = linkAkhir;

    makeQR("qr1", linkAwal);
    makeQR("qr2", linkAkhir);

    await saveQRHistory(event, linkAwal, "Daftar Hadir + Pretest");
    await saveQRHistory(event, linkAkhir, "Posttest + Evaluasi");
}


function makeQR(elementId, text) {

    const box = document.getElementById(elementId);

    if (!box) return;

    box.innerHTML = "";

    new QRCode(box, {
        text: text,
        width: 260,
        height: 260,
        correctLevel: QRCode.CorrectLevel.H
    });
}


async function saveQRHistory(event, link, type) {

    const payload = {
        event_id: event.value,
        event_code: event.dataset.code,
        event_title: event.dataset.title,
        qr_type: type,
        qr_link: link,
        created_at: new Date().toISOString()
    };

    try {
        const { error } = await supabaseClient
            .from("edu_qr_logs")
            .insert(payload);

        if (error) {
            console.error("Save QR history error:", error);
        }

    } catch (err) {
        console.error(err);
    }
}


function copyLink(id) {

    const input = document.getElementById(id);

    navigator.clipboard.writeText(input.value)
        .then(() => alert("Link berhasil disalin"));
}


function downloadQR(id, name) {

    const img = document.querySelector(`#${id} img`);

    if (!img) {
        alert("QR belum dibuat");
        return;
    }

    const a = document.createElement("a");
    a.href = img.src;
    a.download = `${name}.png`;
    a.click();
}


window.addEventListener("load", loadEvents);
