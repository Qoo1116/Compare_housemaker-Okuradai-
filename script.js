// script.js
document.addEventListener('DOMContentLoaded', () => {
  /* インビュー表示 */
  const blocks = [...document.querySelectorAll('.block')];
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        // Optional: Stop observing once visible to improve performance
        // io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 }); // thresholdを少し低めに設定

  blocks.forEach(b => io.observe(b));

  /* 目次生成 & ドロワー制御 */
  const tocDrawer = document.getElementById('tocDrawer');
  const tocToggle = document.getElementById('tocToggle');
  const tocList = tocDrawer.querySelector('ul');
  const tocCloseBtn = tocDrawer.querySelector('.close');

  // 目次リストをクリア（動的生成のため）
  tocList.innerHTML = '';

  document.querySelectorAll('h2').forEach((h, i) => {
    // IDがない場合のみ設定（既に存在する場合を考慮）
    if (!h.id) {
        h.id = 'sec' + i;
    }
    const li = document.createElement('li');
    // h2内の絵文字を除去してテキストのみ取得
    const titleText = h.textContent.replace(/^[^\w\s]+/, '').trim(); // 絵文字(非単語文字)とスペース除去
    li.innerHTML = `<a href="#${h.id}">${titleText}</a>`;
    tocList.appendChild(li);

    // 目次リンククリックでドロワーを閉じる
    li.querySelector('a').addEventListener('click', () => {
        tocDrawer.classList.remove('open');
    });
  });

  tocToggle.onclick = () => tocDrawer.classList.toggle('open');
  tocCloseBtn.onclick = () => tocDrawer.classList.remove('open');
  // ドロワー外クリックで閉じる（オプション）
  document.addEventListener('click', (e) => {
      // tocToggle自身は除外
      if (tocDrawer.classList.contains('open') && !tocDrawer.contains(e.target) && !tocToggle.contains(e.target)) {
          tocDrawer.classList.remove('open');
      }
  });


  /* ToTop ボタン制御 */
  const toTop = document.getElementById('toTop');

  // 初期状態を設定
  toTop.style.display = 'none'; // JSで制御するためCSSの初期非表示から変更
  toTop.classList.remove('visible');

  toTop.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  let lastScrollY = window.scrollY;
  let ticking = false;

  const handleScroll = () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (lastScrollY > 600) {
          toTop.style.display = 'flex'; // displayをflexに戻す
          toTop.classList.add('visible'); // visibleクラスでopacity制御
        } else {
          // 非表示にする前にopacityアニメーションが終わるのを待つ必要はない
          // visibleクラスがなければCSSでopacity: 0, visibility: hiddenになる
          toTop.classList.remove('visible');
           // visibility: hiddenになった後、パフォーマンスのためにdisplay:noneにする
           // ただし、transitionendは複数回発火する可能性があるので注意が必要
           // もっと簡単な方法はsetTimeoutを使うことだが、ここではクラス制御に任せる
           // display: noneにすぐ切り替えるとtransitionが効かない場合があるため、
           // CSSのvisibilityで制御するのが良い
           if (!toTop.classList.contains('visible')) {
               // すぐにdisplay:noneにせず、CSS transitionに任せる
               // 必要であればtransitionendで制御
                toTop.addEventListener('transitionend', () => {
                    if (!toTop.classList.contains('visible')) {
                        toTop.style.display = 'none';
                    }
                }, { once: true });
           }

        }
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll);
  // 初期表示判定
  handleScroll();

});