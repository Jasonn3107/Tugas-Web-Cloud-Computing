// InspireMe! Random Quote Generator
const quotes = [
  { quoteText: 'Kesuksesan adalah akumulasi usaha kecil yang diulang setiap hari.', quoteAuthor: 'Robert Collier' },
  { quoteText: 'Kekuatan tidak datang dari kemampuan fisik, tetapi dari kemauan yang tak tergoyahkan.', quoteAuthor: 'Mahatma Gandhi' },
  { quoteText: 'Mulailah dari mana pun Anda berada. Gunakan apa yang Anda punya. Lakukan apa yang Anda bisa.', quoteAuthor: 'Arthur Ashe' },
  { quoteText: 'Disiplin adalah jembatan antara tujuan dan pencapaian.', quoteAuthor: 'Jim Rohn' },
  { quoteText: 'Percaya diri adalah rahasia pertama dari kesuksesan.', quoteAuthor: 'Ralph Waldo Emerson' },
  { quoteText: 'Jangan menunggu inspirasi. Jadilah inspirasi.', quoteAuthor: 'Anonim' },
  { quoteText: 'Kegagalan adalah kesempatan untuk memulai lagi dengan lebih cerdas.', quoteAuthor: 'Henry Ford' },
  { quoteText: 'Tujuan bukanlah selalu untuk menang, tetapi untuk menjadi lebih baik setiap hari.', quoteAuthor: 'Anonim' },
  { quoteText: 'Keberanian adalah langkah pertama menuju perubahan.', quoteAuthor: 'Winston Churchill' },
  { quoteText: 'Anda tidak harus hebat untuk memulai, tetapi Anda harus memulai untuk menjadi hebat.', quoteAuthor: 'Zig Ziglar' },
  { quoteText: 'Fokus pada kemajuan, bukan kesempurnaan.', quoteAuthor: 'Anonim' },
  { quoteText: 'Waktu terbaik menanam pohon adalah 20 tahun lalu. Waktu terbaik berikutnya adalah sekarang.', quoteAuthor: 'Peribahasa Tiongkok' },
  { quoteText: 'Hanya mereka yang berani gagal yang dapat meraih keberhasilan besar.', quoteAuthor: 'Robert F. Kennedy' },
  { quoteText: 'Impian tidak bekerja kecuali kamu melakukannya.', quoteAuthor: 'John C. Maxwell' },
  { quoteText: 'Langkah kecil hari ini membuka jalan besar besok.', quoteAuthor: 'Anonim' }
];

const quoteTextEl = document.getElementById('quoteText');
const quoteAuthorEl = document.getElementById('quoteAuthor');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const copyBtn = document.getElementById('copyBtn');
const tweetBtn = document.getElementById('tweetBtn');

let lastIndex = -1;

function getRandomIndex() {
  if (quotes.length <= 1) return 0;
  let idx;
  do {
    idx = Math.floor(Math.random() * quotes.length);
  } while (idx === lastIndex);
  lastIndex = idx;
  return idx;
}

function renderQuote() {
  const idx = getRandomIndex();
  const { quoteText, quoteAuthor } = quotes[idx];
  quoteTextEl.textContent = `"${quoteText}"`;
  quoteAuthorEl.textContent = `— ${quoteAuthor}`;
  quoteTextEl.parentElement.classList.remove('fade');
  void quoteTextEl.parentElement.offsetWidth; // restart animation
  quoteTextEl.parentElement.classList.add('fade');
}

function copyQuote() {
  const textToCopy = `${quoteTextEl.textContent} ${quoteAuthorEl.textContent}`;
  navigator.clipboard?.writeText(textToCopy).then(
    () => alert('Kutipan berhasil disalin!'),
    () => fallbackCopy(textToCopy)
  );
}

function fallbackCopy(text) {
  const temp = document.createElement('textarea');
  temp.value = text;
  temp.style.position = 'fixed';
  temp.style.opacity = '0';
  document.body.appendChild(temp);
  temp.select();
  try {
    document.execCommand('copy');
    alert('Kutipan berhasil disalin!');
  } catch (err) {
    alert('Maaf, salin kutipan gagal.');
  } finally {
    document.body.removeChild(temp);
  }
}

function shareToTwitter() {
  const text = encodeURIComponent(`${quoteTextEl.textContent} ${quoteAuthorEl.textContent}`);
  const url = `https://twitter.com/intent/tweet?text=${text}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

newQuoteBtn.addEventListener('click', renderQuote);
copyBtn.addEventListener('click', copyQuote);
tweetBtn.addEventListener('click', shareToTwitter);

// Initial load
renderQuote();

