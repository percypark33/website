/* ============================================================
   SWEET SNOW — OUR STORY · the family letter (October 2026)
   ------------------------------------------------------------
   Edit LETTER_EN / LETTER_KO to change the letter, and PHOTOS_EN /
   PHOTOS_KO to change photo words. Photo files live in /assets/story/.
   ============================================================ */
(() => {
  const PHOTO_FOLDER = '/assets/story/';

  const PHOTOS_EN = {
    left: [
      { file: 'winter.jpg', alt: 'Two customers ordering at the Sweet Snow counter, with a small Christmas tree and string lights behind it', caption: 'our first winter', date: 'Dec 2025', tilt: -3, tape: -5 },
      { file: 'pastry.jpg', alt: 'In the kitchen, one of us folds red bean into pastry dough while another watches', caption: 'red bean practice', date: 'Moments after opening', tilt: 2.5, tape: 4 },
      { file: 'family-time.jpg', alt: 'A smiling baby in a stroller at the food court, with a Lunar New Year 2026 banner in the background', caption: 'family time', date: 'Feb 2026', tilt: -2, tape: -3 }
    ],
    right: [
      { file: 'test-bowl.jpg', alt: 'Two of us at the snow machine, building a test bowl by hand', caption: 'testing a new bowl', date: 'Moments after opening', tilt: 3, tape: 6 },
      { file: 'behind-the-glass.jpg', alt: 'Two of us working behind the glass at the Sweet Snow counter, under a neon open sign', caption: 'behind the glass', date: 'Moments after opening', tilt: -2.5, tape: -4 },
      { file: 'counter.jpg', alt: 'The Sweet Snow counter inside QT Golden Market Place, with the lit sign and menu boards', caption: 'our counter today', date: 'About a year in', tilt: 2, tape: 3 }
    ],
    row: [
      { file: 'cookies-and-cream.jpg', alt: 'Two test bowls of cookies and cream bingsu with cocoa, sprinkles and Oreo cookies', caption: 'cookies and cream', date: 'Started adding cream top!', tilt: -2, tape: -4 },
      { file: 'dubai-chocolate.jpg', alt: 'A Dubai chocolate test bowl with cocoa, chocolate drizzle, crushed nuts and mochi', caption: 'Dubai chocolate', date: 'Failed', tilt: 1.5, tape: 3 },
      { file: 'lychee-heaven.jpg', alt: 'Lychee Heaven bingsu topped with lychee, a scoop of ice cream and toasted coconut', caption: 'Lychee Heaven', note: 'Yay. It worked! The first whole lychee topped bingsu ever made.', date: '9.20.26', tilt: -1.5, tape: -2 }
    ]
  };

  const PHOTOS_KO = {
    left: [
      { file: 'winter.jpg', alt: '작은 크리스마스트리와 전구 장식이 있는 Sweet Snow 카운터에서 주문하는 두 손님', caption: '우리의 첫 겨울', date: '2025년 12월', tilt: -3, tape: -5 },
      { file: 'pastry.jpg', alt: '주방에서 한 사람이 팥을 반죽에 넣고 다른 사람이 지켜보는 모습', caption: '팥 붕어빵 연습', date: '오픈 직후', tilt: 2.5, tape: 4 },
      { file: 'family-time.jpg', alt: '2026년 설 배너가 보이는 푸드코트에서 유모차에 앉아 웃고 있는 아기', caption: '가족 시간', date: '2026년 2월', tilt: -2, tape: -3 }
    ],
    right: [
      { file: 'test-bowl.jpg', alt: '눈꽃빙수 기계 앞에서 손으로 테스트 빙수를 만드는 두 사람', caption: '새 빙수 테스트', date: '오픈 직후', tilt: 3, tape: 6 },
      { file: 'behind-the-glass.jpg', alt: '네온 오픈 사인 아래 유리 카운터 뒤에서 일하는 두 사람', caption: '카운터 뒤에서', date: '오픈 직후', tilt: -2.5, tape: -4 },
      { file: 'counter.jpg', alt: '불이 켜진 간판과 메뉴 보드가 있는 QT Golden Market Place 안의 Sweet Snow 카운터', caption: '오늘의 우리 카운터', date: '약 1년 후', tilt: 2, tape: 3 }
    ],
    row: [
      { file: 'cookies-and-cream.jpg', alt: '코코아, 스프링클, 오레오 쿠키를 올린 쿠키 앤 크림 빙수 테스트 두 그릇', caption: '쿠키 앤 크림', date: '크림 토핑을 넣기 시작했어요!', tilt: -2, tape: -4 },
      { file: 'dubai-chocolate.jpg', alt: '코코아, 초콜릿 드리즐, 견과류 조각, 모찌를 올린 두바이 초콜릿 빙수 테스트', caption: '두바이 초콜릿', date: '실패', tilt: 1.5, tape: 3 },
      { file: 'lychee-heaven.jpg', alt: '리치, 아이스크림 한 스쿱, 구운 코코넛을 올린 리치 헤븐 빙수', caption: '리치 헤븐', note: '성공! 처음으로 통리치를 올려 만든 빙수였어요.', date: '2026. 9. 20.', tilt: -1.5, tape: -2 }
    ]
  };

  const LETTER_EN = `
    <img class="sl-logo" src="/assets/sweet-snow-horizontal-right-blue-20261104.svg" width="1881" height="837" alt="Sweet Snow, Korean Dessert Cafe">
    <p class="sl-eyebrow">Our story</p>
    <h2 class="sl-title">Hi. We’re the family behind Sweet Snow.</h2>
    <p>We’re a family from Korea, sharing our love of bingsu here in Garden Grove.</p>
    <p>One evening in the summer of 2025, our dad sat the three of us down at the dinner table and asked, out of nowhere:</p>
    <p class="sl-question">“Why don’t we try selling bingsu?”</p>
    <p>That simple question became Sweet Snow. Today, we’re still <strong>100% family owned</strong>, and everything is run by <strong>our family and friends</strong>.</p>
    <p>As we grow, we keep coming back to <strong>three goals.</strong></p>
    <ol class="sl-goals">
      <li><span class="sl-num" aria-hidden="true">1</span><div class="sl-goal"><h3>Raising the quality standard.</h3><p>We choose ingredients with the same care we would for our own family.</p></div></li>
      <li><span class="sl-num" aria-hidden="true">2</span><div class="sl-goal"><h3>Creating something worth coming back for.</h3><p>We love trying new flavors and combinations, but every idea starts with one thing: it has to taste good.</p></div></li>
      <li><span class="sl-num" aria-hidden="true">3</span><div class="sl-goal"><h3>Building a healthy community.</h3><p>We want Sweet Snow to be a welcoming place where people feel cared for and connected. Love and honesty are at the heart of that.</p></div></li>
    </ol>
    <p>Our hope is simple: to make something we’re proud to share, and give you a reason to come back with the people you love.</p>
    <p>Our story started in Garden Grove, and we’re excited to keep growing. <strong>New locations coming soon.</strong></p>
    <div class="sl-signoff"><p>Thank you for coming by,</p><p class="sl-name">the Park family</p></div>`;

  const LETTER_KO = `
    <img class="sl-logo" src="/assets/sweet-snow-horizontal-right-blue-20261104.svg" width="1881" height="837" alt="Sweet Snow, Korean Dessert Cafe">
    <p class="sl-eyebrow">우리 이야기</p>
    <h2 class="sl-title">안녕하세요. Sweet Snow를 운영하는 가족입니다.</h2>
    <p>저희는 한국에서 온 가족입니다. 지금은 가든그로브에서 저희가 좋아하는 빙수를 나누고 있어요.</p>
    <p>2025년 여름 어느 저녁, 아버지가 저희 셋을 식탁에 앉히시고 갑자기 물으셨어요.</p>
    <p class="sl-question">“우리 빙수 한번 팔아볼까?”</p>
    <p>그 한마디에서 Sweet Snow가 시작됐어요. 지금도 <strong>100% 가족 소유</strong>로, <strong>가족과 친구들이 함께 운영</strong>하고 있습니다.</p>
    <p>조금씩 성장하면서도 저희가 늘 기억하는 <strong>세 가지 목표</strong>가 있어요.</p>
    <ol class="sl-goals">
      <li><span class="sl-num" aria-hidden="true">1</span><div class="sl-goal"><h3>품질의 기준을 높입니다.</h3><p>우리 가족이 먹는다는 마음으로 재료 하나하나를 정성껏 고릅니다.</p></div></li>
      <li><span class="sl-num" aria-hidden="true">2</span><div class="sl-goal"><h3>다시 찾고 싶은 맛을 만듭니다.</h3><p>새로운 맛과 조합을 시도하는 걸 좋아해요. 하지만 무엇보다 맛있어야 한다는 기본은 잊지 않습니다.</p></div></li>
      <li><span class="sl-num" aria-hidden="true">3</span><div class="sl-goal"><h3>건강한 공동체를 만듭니다.</h3><p>누구나 편하게 들러 따뜻한 마음을 느끼고 서로 이어질 수 있는 공간이 되고 싶어요. 그 바탕에는 사랑과 정직함이 있습니다.</p></div></li>
    </ol>
    <p>저희가 자랑스럽게 나눌 수 있는 디저트를 만들고, 여러분이 소중한 사람들과 다시 찾아오고 싶은 곳이 되는 것이 저희의 바람입니다.</p>
    <p>우리 이야기는 가든그로브에서 시작되었고, 앞으로도 계속 성장할 생각에 설렙니다. <strong>새로운 매장도 곧 찾아옵니다.</strong></p>
    <div class="sl-signoff"><p>찾아와 주셔서 감사합니다.</p><p class="sl-name">박 가족 드림</p></div>`;

  const escapeHtml = text => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const polaroid = p => `<figure class="sl-polaroid" style="--tilt:${Number(p.tilt) || 0}deg;--tape:${Number(p.tape) || 0}deg"><span class="sl-tape" aria-hidden="true"></span><img src="${PHOTO_FOLDER}${escapeHtml(p.file)}" width="760" height="760" alt="${escapeHtml(p.alt)}" loading="lazy" decoding="async"><figcaption><span class="sl-caption">${escapeHtml(p.caption)}</span>${p.note ? `<span class="sl-note">${escapeHtml(p.note)}</span>` : ''}<span class="sl-date">${escapeHtml(p.date)}</span></figcaption></figure>`;
  const photos = (side, list) => `<div class="sl-photos sl-photos--${side}">${list.map(polaroid).join('')}</div>`;
  const currentLanguage = () => {
    if (window.SweetSnowLanguage?.get?.() === 'ko') return 'ko';
    try { return localStorage.getItem('sweet-snow-language') === 'ko' ? 'ko' : 'en'; } catch (_) { return 'en'; }
  };
  const render = (section, sheet, language) => {
    const korean = language === 'ko';
    const photoSet = korean ? PHOTOS_KO : PHOTOS_EN;
    const letter = korean ? LETTER_KO : LETTER_EN;
    section.lang = language;
    section.setAttribute('aria-label', korean ? '우리 이야기' : 'Our story');
    const markup = `<link rel="stylesheet" href="${escapeHtml(sheet.getAttribute('href'))}"><div class="sl-wrap">${photos('left', photoSet.left)}<article class="sl-letter" lang="${language}">${letter}</article>${photos('right', photoSet.right)}${photos('row', photoSet.row)}</div><slot></slot>`;
    if (section.shadowRoot) section.shadowRoot.innerHTML = markup;
    else section.innerHTML = markup.replace('<slot></slot>', '');
  };

  const addStory = () => {
    const main = document.querySelector('main');
    if (!main || document.getElementById('brand-story')) return;
    let sheet = document.querySelector('link[rel="stylesheet"][href*="brand-story.css"]');
    if (!sheet) { sheet = document.createElement('link'); sheet.rel = 'stylesheet'; sheet.href = '/designs/brand-story.css'; document.head.append(sheet); }
    const section = document.createElement('section');
    section.id = 'brand-story';
    section.className = 'story-letter';
    if (section.attachShadow) section.attachShadow({ mode: 'open' });
    render(section, sheet, currentLanguage());
    main.insertBefore(section, main.querySelector('#catering') || null);
    document.addEventListener('sweetsnowlanguagechange', event => render(section, sheet, event.detail?.language === 'ko' ? 'ko' : 'en'));
    const nav = document.querySelector('.main-nav');
    if (nav && !nav.querySelector('[href="#brand-story"]')) { const link = document.createElement('a'); link.href = '#brand-story'; link.textContent = 'Our story'; nav.append(link); }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addStory, { once: true });
  else addStory();
})();
