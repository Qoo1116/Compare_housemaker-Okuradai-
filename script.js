document.addEventListener('DOMContentLoaded', () => {

  /* インビュー表示 */
  const blocks = [...document.querySelectorAll('.block')];
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // 一度表示されたら監視を停止（オプション）
          // io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 }); // 閾値を少し低めに設定

    blocks.forEach(b => io.observe(b));
  } else {
    // IntersectionObserver非対応ブラウザ用のフォールバック
    blocks.forEach(b => b.classList.add('visible'));
  }

  /* 目次生成 と スムーズスクロール */
  const tocDrawer = document.getElementById('tocDrawer');
  const tocList = tocDrawer.querySelector('ul');
  const tocToggle = document.getElementById('tocToggle');
  const tocCloseBtn = tocDrawer.querySelector('.close');
  const headings = document.querySelectorAll('h2'); // h2を目次対象とする

  headings.forEach((h, i) => {
    // IDがなければ自動付与
    if (!h.id) {
        h.id = 'sec' + i;
    }
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = '#' + h.id;
    // FontAwesomeアイコンを除去してテキストのみ取得
    link.textContent = h.textContent.trim().replace(/^[\s\S]*\s/, ''); // 絵文字部分を除去する簡易的な方法
    li.appendChild(link);
    tocList.appendChild(li);

    // 目次リンククリック時のスムーズスクロールとドロワーを閉じる
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetElement = document.getElementById(h.id);
        if (targetElement) {
            // ヘッダーの高さを考慮したオフセット（固定ヘッダーがない場合は0）
            const offset = 0;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = targetElement.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
        tocDrawer.classList.remove('open'); // ドロワーを閉じる
    });
  });

  // 目次トグルボタンのイベント
  tocToggle.onclick = () => tocDrawer.classList.toggle('open');
  tocCloseBtn.onclick = () => tocDrawer.classList.remove('open');
  // ドロワー外クリックで閉じる（オプション）
  document.addEventListener('click', (e) => {
    if (tocDrawer.classList.contains('open') && !tocDrawer.contains(e.target) && e.target !== tocToggle) {
      tocDrawer.classList.remove('open');
    }
  });


  /* ToTop ボタン表示制御 と スムーズスクロール */
  const toTop = document.getElementById('toTop');
  const scrollThreshold = 300; // ボタン表示を開始するスクロール量

  // スクロールイベントで表示/非表示を切り替え
  window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
      toTop.classList.add('visible'); // 表示用のクラスを付与
    } else {
      toTop.classList.remove('visible'); // 表示用のクラスを削除
    }
  });

  // ボタンクリックでトップへ戻る
  toTop.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

});