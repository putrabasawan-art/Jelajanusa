/* =========================================================
   JelajahNusa - script.js
   1. Data paket          5. Validasi form
   2. Helper              6. Form booking
   3. Modal detail paket  7. Galeri & lain-lain
   4. Notifikasi
   ========================================================= */
'use strict';

/* ---------- 1. Data paket ---------- */
const PACKAGES = {
  'bali-escape': {
    name: 'Bali Escape',
    destination: 'Bali',
    duration: '3 Hari 2 Malam',
    price: 2450000,
    image: 'assets/bali.jpg',
    tone: 'bali',
    alt: 'Pantai dan pura di Bali',
    description:
      'Tiga hari untuk merasakan sisi terbaik Bali: pantai di selatan, pura di atas tebing, dan sunset yang menutup hari.',
    itinerary: [
      'Hari 1: Jemput di bandara, check-in hotel, sore santai di Pantai Jimbaran.',
      'Hari 2: Pura Uluwatu, pertunjukan tari Kecak, dan sunset di tebing.',
      'Hari 3: Pasar seni Ubud, belanja oleh-oleh, lalu antar ke bandara.'
    ],
    facilities: [
      'Transportasi selama tour',
      'Penginapan 2 malam',
      'Tiket masuk objek wisata',
      'Pemandu berpengalaman',
      'Sarapan setiap pagi',
      'Dokumentasi perjalanan'
    ]
  },

  'bromo-sunrise': {
    name: 'Bromo Sunrise Trip',
    destination: 'Bromo, Jawa Timur',
    duration: '2 Hari 1 Malam',
    price: 1350000,
    image: 'assets/bromo.jpg',
    tone: 'bromo',
    alt: 'Gunung Bromo saat matahari terbit',
    description:
      'Berangkat dini hari untuk menyaksikan matahari terbit dari Penanjakan, lalu berjalan di lautan pasir menuju kawah Bromo.',
    itinerary: [
      'Hari 1: Tiba di Malang atau Probolinggo, istirahat dan briefing malam hari.',
      'Hari 2 (dini hari): Jeep ke Penanjakan untuk sunrise, lanjut ke lautan pasir dan kawah Bromo.',
      'Hari 2 (siang): Sarapan, kembali ke hotel, lalu antar ke titik kepulangan.'
    ],
    facilities: [
      'Transportasi dari dan ke titik jemput',
      'Penginapan 1 malam',
      'Jeep 4WD di kawasan Bromo',
      'Tiket masuk TNBTS',
      'Pemandu berpengalaman',
      'Sarapan'
    ]
  },

  'raja-ampat-discovery': {
    name: 'Raja Ampat Discovery',
    destination: 'Raja Ampat, Papua Barat Daya',
    duration: '4 Hari 3 Malam',
    price: 5750000,
    image: 'assets/rajaAmpat.jpg',
    tone: 'raja',
    alt: 'Laut biru dan gugusan pulau Raja Ampat',
    description:
      'Island hopping di gugusan pulau karst dan snorkeling di terumbu karang yang menjadi alasan Raja Ampat dikenal dunia.',
    itinerary: [
      'Hari 1: Tiba di Sorong, menyeberang ke Waisai, check-in homestay.',
      'Hari 2: Island hopping ke Pianemo dan spot snorkeling di sekitarnya.',
      'Hari 3: Desa Arborek, snorkeling bersama ikan karang, dan sunset di dermaga.',
      'Hari 4: Kembali ke Sorong dan antar ke bandara.'
    ],
    facilities: [
      'Speedboat selama island hopping',
      'Penginapan 3 malam',
      'Peralatan snorkeling',
      'Izin masuk kawasan konservasi',
      'Pemandu lokal',
      'Makan sesuai jadwal tour'
    ]
  },

  'labuan-bajo-explorer': {
    name: 'Labuan Bajo Explorer',
    destination: 'Labuan Bajo, Nusa Tenggara Timur',
    duration: '3 Hari 2 Malam',
    price: 3950000,
    image: 'assets/labuanBajo.jpg',
    tone: 'bajo',
    alt: 'Pulau dan laut di Labuan Bajo',
    description:
      'Berlayar menyusuri gugusan pulau, bertemu komodo di habitat aslinya, dan berhenti di pantai-pantai yang sulit dicapai lewat darat.',
    itinerary: [
      'Hari 1: Tiba di Labuan Bajo, check-in, lalu menikmati sunset di Bukit Cinta.',
      'Hari 2: Sailing ke Pulau Padar dan Pulau Komodo, lanjut snorkeling di Pink Beach.',
      'Hari 3: Manta Point atau Pulau Kanawa, lalu antar ke bandara.'
    ],
    facilities: [
      'Kapal selama sailing',
      'Penginapan 2 malam',
      'Tiket masuk Taman Nasional Komodo',
      'Pemandu dan ranger',
      'Peralatan snorkeling',
      'Makan di atas kapal'
    ]
  }
};

const GALLERY_CAPTIONS = {
  1: 'Snorkeling di perairan jernih',
  2: 'Menikmati budaya lokal',
  3: 'Berjalan di jalur pegunungan',
  4: 'Sunset di tepi pantai',
  5: 'Berlayar antar pulau',
  6: 'Mencicipi kuliner khas daerah'
};

/* ---------- 2. Helper ---------- */
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const formatRupiah = (angka) => 'Rp' + angka.toLocaleString('id-ID');

function formatTanggalID(isoDate) {
  if (!isoDate) return '-';
  const [y, m, d] = isoDate.split('-');
  return `${d}/${m}/${y}`;
}

/* Jika foto belum ada, sembunyikan gambar rusak agar gradient latar terlihat */
document.addEventListener(
  'error',
  (e) => {
    if (e.target.tagName === 'IMG') e.target.classList.add('is-missing');
  },
  true
);
document.addEventListener(
  'load',
  (e) => {
    if (e.target.tagName === 'IMG') e.target.classList.remove('is-missing');
  },
  true
);

/* ---------- 3. Modal detail paket ---------- */
const packageModalEl = $('#packageModal');
const packageModal = new bootstrap.Modal(packageModalEl);
let activePackageId = null;

function openPackage(id) {
  const pkg = PACKAGES[id];
  if (!pkg) return;
  activePackageId = id;

  $('#pm-name').textContent = pkg.name;
  $('#pm-dest').textContent = pkg.destination;
  $('#pm-duration').textContent = pkg.duration;
  $('#pm-price').textContent = formatRupiah(pkg.price);
  $('#pm-desc').textContent = pkg.description;

  const img = $('#pm-img');
  img.classList.remove('is-missing');
  img.src = pkg.image;
  img.alt = pkg.alt;
  $('#pm-photo').className = 'photo pm-photo photo--' + pkg.tone;

  const itinerary = $('#pm-itinerary');
  itinerary.replaceChildren();
  pkg.itinerary.forEach((text) => {
    const li = document.createElement('li');
    li.textContent = text;
    itinerary.append(li);
  });

  const facilities = $('#pm-facilities');
  facilities.replaceChildren();
  pkg.facilities.forEach((text) => {
    const li = document.createElement('li');
    const icon = document.createElement('i');
    icon.className = 'bi bi-check-circle-fill';
    icon.setAttribute('aria-hidden', 'true');
    li.append(icon, document.createTextNode(text));
    facilities.append(li);
  });

  packageModal.show();
}

/* Semua tombol dengan atribut data-package membuka modal */
document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-package]');
  if (!trigger) return;
  e.preventDefault();
  openPackage(trigger.dataset.package);
});

/* Simulasi pemesanan: tutup modal, arahkan ke form booking dengan paket terisi */
$('#pm-order').addEventListener('click', () => {
  const id = activePackageId;
  packageModalEl.addEventListener(
    'hidden.bs.modal',
    () => {
      selectPackage(id);
      $('#booking').scrollIntoView({ behavior: 'smooth', block: 'start' });
      showToast('Paket dipilih', PACKAGES[id].name + ' sudah terisi di form booking. Lengkapi datanya.');
    },
    { once: true }
  );
  packageModal.hide();
});

/* ---------- 4. Notifikasi ---------- */
const toastEl = $('#appToast');
const toast = new bootstrap.Toast(toastEl, { delay: 5500 });

function showToast(title, text, isError = false) {
  $('#toastTitle').textContent = title;
  $('#toastText').textContent = text;
  toastEl.classList.toggle('is-error', isError);
  $('#toastIcon').className = isError
    ? 'bi bi-exclamation-circle-fill toast-icon'
    : 'bi bi-check-circle-fill toast-icon';
  toast.show();
}

/* ---------- 5. Validasi form ---------- */
function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

const RULES = {
  name: (v) => {
    if (!v) return 'Nama lengkap wajib diisi.';
    if (v.length < 3) return 'Nama terlalu pendek, minimal 3 karakter.';
    return '';
  },
  package: (v) => (v ? '' : 'Pilih salah satu paket wisata.'),
  date: (v) => {
    if (!v) return 'Tanggal keberangkatan wajib diisi.';
    if (v < tomorrowISO()) return 'Tanggal keberangkatan minimal besok.';
    return '';
  },
  people: (v) => {
    const n = Number(v);
    if (!v) return 'Jumlah peserta wajib diisi.';
    if (!Number.isInteger(n) || n < 1 || n > 20) return 'Jumlah peserta antara 1 sampai 20 orang.';
    return '';
  }
};

function validateField(field) {
  const rule = RULES[field.name];
  const message = rule ? rule(field.value.trim()) : '';
  const feedback = field.parentElement.querySelector('.invalid-feedback');

  field.classList.toggle('is-invalid', Boolean(message));
  field.classList.toggle('is-valid', !message);
  field.setAttribute('aria-invalid', message ? 'true' : 'false');
  if (feedback) feedback.textContent = message;
  return !message;
}

function validateForm(form) {
  const fields = $$('[name]', form);
  const results = fields.map(validateField);
  const firstInvalid = fields[results.indexOf(false)];
  if (firstInvalid) firstInvalid.focus();
  return results.every(Boolean);
}

function liveValidate(form) {
  form.addEventListener('input', (e) => {
    if (e.target.name && (e.target.classList.contains('is-invalid') || e.target.classList.contains('is-valid'))) {
      validateField(e.target);
    }
  });
  form.addEventListener('change', (e) => {
    if (e.target.name) validateField(e.target);
  });
  form.addEventListener(
    'blur',
    (e) => {
      if (e.target.name && e.target.value.trim() !== '') validateField(e.target);
    },
    true
  );
}

/* ---------- 6. Form booking ---------- */
const bookingForm = $('#bookingForm');
const bPackage = $('#b-package');
const bPeople = $('#b-people');
const bDate = $('#b-date');
const summaryWrap = $('#booking-summary-wrap');
const summaryPlaceholder = $('#booking-placeholder');

bDate.min = tomorrowISO();

function selectPackage(id) {
  bPackage.value = id;
  validateField(bPackage);
}

liveValidate(bookingForm);

/* Hasil ringkasan muncul hanya ketika tombol kuning diklik */
bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validateForm(bookingForm)) {
    showToast('Data belum lengkap', 'Periksa kolom yang ditandai merah, lalu klik tombol lagi.', true);
    return;
  }

  const pkg = PACKAGES[bPackage.value];
  const people = Number(bPeople.value);
  const nama = $('#b-name').value.trim();
  const tanggal = bDate.value;
  const totalBiaya = pkg.price * people;

  // Isi data ke panel ringkasan
  $('#sum-name').textContent = nama;
  $('#sum-package').textContent = pkg.name;
  $('#sum-duration').textContent = pkg.duration;
  $('#sum-date').textContent = formatTanggalID(tanggal);
  $('#sum-price').textContent = formatRupiah(pkg.price);
  $('#sum-people').textContent = people + ' orang';
  $('#sum-total').textContent = formatRupiah(totalBiaya);

  // Tampilkan hasil ringkasan & sembunyikan teks placeholder
  summaryPlaceholder.classList.add('d-none');
  summaryWrap.classList.remove('d-none');

  showToast(
    'Permintaan booking berhasil',
    `Terima kasih, ${nama}. Total biaya ${pkg.name} untuk ${people} orang adalah ${formatRupiah(totalBiaya)}.`
  );
});

/* ---------- 7. Galeri & lain-lain ---------- */
const galleryModal = new bootstrap.Modal($('#galleryModal'));

$$('[data-gallery]').forEach((button) => {
  button.addEventListener('click', () => {
    const nomor = button.dataset.gallery;
    const img = $('#gm-img');
    img.classList.remove('is-missing');
    img.src = `assets/images/gallery-0${nomor}.jpg`;
    img.alt = GALLERY_CAPTIONS[nomor];
    $('#gm-caption').textContent = GALLERY_CAPTIONS[nomor];
    galleryModal.show();
  });
});

/* Tutup menu mobile setelah salah satu link dipilih */
const navMenu = $('#navMenu');
$$('.site-nav .nav-link, .nav-cta').forEach((link) => {
  link.addEventListener('click', () => {
    if (navMenu.classList.contains('show')) {
      bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
    }
  });
});

$('#year').textContent = new Date().getFullYear();