// script.js (変更なし - Intersection Observer設定修正済み)
document.addEventListener('DOMContentLoaded', () => {
  /* インビュー表示 */
  const blocks = [...document.querySelectorAll('.block')];
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.01
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, observerOptions);
  blocks.forEach(b => io.observe(b));

  /* 目次生成 & ドロワー制御 */
  const tocDrawer = document.getElementById('tocDrawer');
  const tocToggle = document.getElementById('tocToggle');
  const tocList = tocDrawer.querySelector('ul');
  const tocCloseBtn = tocDrawer.querySelector('.close');

  tocList.innerHTML = ''; // 目次リストをクリア

  document.querySelectorAll('h2').forEach((h, i) => {
    if (!h.id) {
      if (h.textContent.includes('出典一覧')) {
         h.id = 'sec' + (document.querySelectorAll('h2').length -1);
      } else {
         h.id = 'sec' + i;
      }
    }

    const li = document.createElement('li');
    const titleText = h.textContent.replace(/^[^\w\s]+/, '').trim();
    li.innerHTML = `<a href="#${h.id}">${titleText}</a>`;
    tocList.appendChild(li);

    li.querySelector('a').addEventListener('click', () => {
        tocDrawer.classList.remove('open');
    });
  });

  tocToggle.onclick = () => tocDrawer.classList.toggle('open');
  tocCloseBtn.onclick = () => tocDrawer.classList.remove('open');
  document.addEventListener('click', (e) => {
      if (tocDrawer.classList.contains('open') && !tocDrawer.contains(e.target) && !tocToggle.contains(e.target)) {
          tocDrawer.classList.remove('open');
      }
  });

  /* ToTop ボタン制御 */
  const toTop = document.getElementById('toTop');
  toTop.style.display = 'none';
  toTop.classList.remove('visible');

  toTop.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  let lastScrollY = window.scrollY;
  let ticking = false;

  const handleScroll = () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (lastScrollY > 600) {
          toTop.style.display = 'flex';
          setTimeout(() => toTop.classList.add('visible'), 10);
        } else {
          toTop.classList.remove('visible');
          toTop.addEventListener('transitionend', () => {
              if (!toTop.classList.contains('visible')) {
                  toTop.style.display = 'none';
              }
          }, { once: true });
        }
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // 初期表示判定
});