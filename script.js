"use strict";

const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const HARI_NEPTU = { Minggu: 5, Senin: 4, Selasa: 3, Rabu: 7, Kamis: 8, Jumat: 6, Sabtu: 9 };
const PASARAN = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];
const PASARAN_NEPTU = { Legi: 5, Pahing: 9, Pon: 7, Wage: 4, Kliwon: 8 };
const PASARAN_WATAK = {
  Legi: "Manis tutur katanya, jujur, dan gampang bikin orang nyaman — tapi pendiriannya keras kalau sudah yakin.",
  Pahing: "Semangatnya besar dan tidak gampang menyerah; kadang terburu-buru, tapi selalu berani mulai duluan.",
  Pon: "Tenang, sabar, dan enak diajak kerja sama; tipe yang menyelesaikan masalah tanpa drama.",
  Wage: "Kreatif dan idenya tidak habis-habis; suka kebebasan dan kurang cocok diatur terlalu ketat.",
  Kliwon: "Intuisinya tajam dan perasa; pandai membaca suasana hati orang lain.",
};
// Jangkar: 17 Agustus 1945 = Jumat Legi (hari Proklamasi).
const ANCHOR = Date.UTC(1945, 7, 17);

function wetonOf(date) {
  const utc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const days = Math.round((utc - ANCHOR) / 86400000);
  const pasaran = PASARAN[((days % 5) + 5) % 5];
  const hari = HARI[date.getDay()];
  return { hari, pasaran, neptu: HARI_NEPTU[hari] + PASARAN_NEPTU[pasaran], days };
}

function zodiacOf(d) {
  const m = d.getMonth() + 1, day = d.getDate();
  const z = [[1,19,"Capricorn","Aquarius"],[2,18,"Aquarius","Pisces"],[3,20,"Pisces","Aries"],[4,19,"Aries","Taurus"],[5,20,"Taurus","Gemini"],[6,20,"Gemini","Cancer"],[7,22,"Cancer","Leo"],[8,22,"Leo","Virgo"],[9,22,"Virgo","Libra"],[10,22,"Libra","Scorpio"],[11,21,"Scorpio","Sagitarius"],[12,21,"Sagitarius","Capricorn"]];
  const row = z[m - 1];
  return day <= row[1] ? row[2] : row[3];
}

function ageDetail(birth, now) {
  let y = now.getFullYear() - birth.getFullYear();
  let m = now.getMonth() - birth.getMonth();
  let d = now.getDate() - birth.getDate();
  if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
  if (m < 0) { y--; m += 12; }
  return { y, m, d };
}

function fmtDate(d) {
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

const todayW = wetonOf(new Date());
document.getElementById("today-weton").textContent = `${todayW.hari} ${todayW.pasaran} (neptu ${todayW.neptu})`;

document.getElementById("check-btn").addEventListener("click", () => {
  const val = document.getElementById("input-date").value;
  const name = document.getElementById("input-name").value.trim();
  if (!val) { alert("Isi tanggal lahirnya dulu ya."); return; }
  const [yy, mm, dd] = val.split("-").map(Number);
  const birth = new Date(yy, mm - 1, dd);
  const now = new Date();
  if (birth > now) { alert("Tanggal lahirnya di masa depan — belum lahir dong 😄"); return; }

  const w = wetonOf(birth);
  const age = ageDetail(birth, now);
  const totalDays = Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(yy, mm - 1, dd)) / 86400000);

  let next = new Date(now.getFullYear(), mm - 1, dd);
  if (next < new Date(now.getFullYear(), now.getMonth(), now.getDate())) next = new Date(now.getFullYear() + 1, mm - 1, dd);
  const toNext = Math.round((Date.UTC(next.getFullYear(), next.getMonth(), next.getDate()) - Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000);

  document.getElementById("r-kicker").textContent = name ? `weton ${name}` : "weton kamu";
  document.getElementById("r-weton").textContent = `${w.hari} ${w.pasaran}`;
  document.getElementById("r-verdict").textContent = `Neptu ${w.neptu} — hari ${w.hari} (${HARI_NEPTU[w.hari]}) + pasaran ${w.pasaran} (${PASARAN_NEPTU[w.pasaran]})`;
  document.getElementById("r-note").textContent = `Menurut primbon: ${PASARAN_WATAK[w.pasaran]}`;
  document.getElementById("r-facts").innerHTML = [
    ["Lahir", fmtDate(birth)],
    ["Umur", `${age.y} tahun ${age.m} bulan ${age.d} hari`],
    ["Total hari hidup", totalDays.toLocaleString("id-ID") + " hari"],
    ["Zodiak", zodiacOf(birth)],
    ["Ulang tahun berikutnya", `${fmtDate(next)} (${toNext === 0 ? "HARI INI! 🎉" : toNext + " hari lagi"})`],
  ].map(([k, v]) => `<div class="fact-chip"><span>${k}</span><strong>${v}</strong></div>`).join("");

  const panel = document.getElementById("result-panel");
  panel.hidden = false;
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
});
