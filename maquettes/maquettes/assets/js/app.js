/* ============================================================
   CodeQuest — comportements de maquette
   Navigation injectée, thème, onglets, éditeur simulé, filtres.
   ============================================================ */

(() => {
  'use strict';

  const ICONS = {
    terminal: '<path d="m4 17 6-6-6-6"/><path d="M12 19h8"/>',
    menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    'chevron-left': '<path d="m15 18-6-6 6-6"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    'chevron-up': '<path d="m18 15-6-6-6 6"/>',
    'arrow-right': '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    'arrow-left': '<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>',
    code: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>',
    trophy: '<path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4a3 3 0 0 0 3 3"/><path d="M17 6h3a3 3 0 0 1-3 3"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    'user-plus': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/>',
    'user-check': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
    skull: '<path d="M8 21v-2a4 4 0 0 1-4-4v-3a8 8 0 1 1 16 0v3a4 4 0 0 1-4 4v2"/><circle cx="9" cy="11" r="1.4"/><circle cx="15" cy="11" r="1.4"/><path d="M10 17h4"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    cart: '<circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M2 3h3l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6"/>',
    chat: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/><path d="M8 9h8"/><path d="M8 13h5"/>',
    'message-square': '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    'shield-check': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    check: '<path d="m20 6-11 11-5-5"/>',
    'check-circle': '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    alert: '<path d="M10.3 3.7 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    'alert-triangle': '<path d="M10.3 3.7 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    unlock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 7.5-2"/>',
    play: '<path d="m7 4 13 8-13 8z"/>',
    pause: '<path d="M8 4v16"/><path d="M16 4v16"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    flame: '<path d="M12 22c4 0 7-3 7-7 0-3-2-6-4-8-1 3-3 4-3 4s-1-4-3-6c-1 4-4 6-4 10 0 4 3 7 7 7z"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8z"/>',
    bolt: '<path d="M13 2 3 14h7l-1 8 10-12h-7z"/>',
    zap: '<path d="M13 2 3 14h7l-1 8 10-12h-7z"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21h-4v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3v-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V3h4v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v4h-.1a1.7 1.7 0 0 0-1.6 1z"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m4.9 19.1 1.4-1.4"/><path d="m17.7 6.3 1.4-1.4"/>',
    moon: '<path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>',
    filter: '<path d="M4 5h16"/><path d="M7 12h10"/><path d="M10 19h4"/>',
    plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
    mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><path d="M12 19v3"/>',
    'mic-off': '<path d="m2 2 20 20"/><path d="M9 9v3a3 3 0 0 0 5.1 2.1"/><path d="M15 9.3V5a3 3 0 0 0-5.8-1"/><path d="M5 10a7 7 0 0 0 10.7 6.1"/><path d="M12 19v3"/>',
    volume: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/>',
    'volume-off': '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="m16 9 5 6"/><path d="m21 9-5 6"/>',
    flag: '<path d="M4 22V4"/><path d="M4 4h12l-2 4 2 4H4"/>',
    trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 15H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z"/>',
    download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
    upload: '<path d="M12 21V9"/><path d="m7 14 5-5 5 5"/><path d="M5 3h14"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 8-8"/><path d="m17 4 3 3"/><path d="m15 6 3 3"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    'eye-off': '<path d="m2 2 20 20"/><path d="M6.7 6.7C4.2 8.5 2 12 2 12s3.5 7 10 7c2 0 3.7-.6 5.2-1.5"/><path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-2.2 3.2"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    sparkles: '<path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8z"/><path d="m5 3 .6 1.4L7 5l-1.4.6L5 7l-.6-1.4L3 5l1.4-.6z"/>',
    layers: '<path d="m12 2 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    list: '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',
    map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15"/><path d="M15 6v15"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 1 1 0-5C11 3 12 8 12 8"/><path d="M16.5 8a2.5 2.5 0 1 0 0-5C13 3 12 8 12 8"/>',
    coin: '<circle cx="12" cy="12" r="9"/><path d="M14.5 9.5c-.5-.8-1.4-1.2-2.5-1.2-1.7 0-3 .9-3 2s1.3 1.8 3 2 3 .9 3 2-1.3 2-3 2c-1.1 0-2-.4-2.5-1.2"/><path d="M12 7v10"/>',
    activity: '<path d="M3 12h4l2-7 4 14 2-7h6"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/>',
    'file-text': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h8"/><path d="M8 9h2"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.6-6.4"/><path d="M21 3v6h-6"/>',
    'external-link': '<path d="M15 3h6v6"/><path d="m10 14 11-11"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="m8.2 13.4-1.4 8 5.2-3 5.2 3-1.4-8"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18"/><path d="M12 3a15 15 0 0 0 0 18"/>',
    headphones: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 14h3v6H5a1 1 0 0 1-1-1z"/><path d="M20 14h-3v6h2a1 1 0 0 0 1-1z"/>',
    hash: '<path d="M4 9h16"/><path d="M4 15h16"/><path d="M10 3 8 21"/><path d="M16 3l-2 18"/>',
    pin: '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    ban: '<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/>',
    sliders: '<path d="M4 6h10"/><path d="M18 6h2"/><path d="M4 12h4"/><path d="M12 12h8"/><path d="M4 18h12"/><path d="M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    server: '<rect x="3" y="4" width="18" height="6" rx="2"/><rect x="3" y="14" width="18" height="6" rx="2"/><path d="M7 7h.01"/><path d="M7 17h.01"/>',
    'git-branch': '<path d="M6 3v12"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
    cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3"/><path d="M15 1v3"/><path d="M9 20v3"/><path d="M15 20v3"/><path d="M1 9h3"/><path d="M1 15h3"/><path d="M20 9h3"/><path d="M20 15h3"/>',
    'hard-drive': '<path d="M22 12H2"/><path d="M5.5 5h13l3.5 7v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5z"/><path d="M6 16h.01"/><path d="M10 16h.01"/>',
    gauge: '<path d="M12 14 16 9"/><path d="M4 18a9 9 0 1 1 16 0"/><circle cx="12" cy="14" r="1"/>',
    'x-circle': '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6"/><path d="m15 9-6 6"/>',
    'user-x': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m17 8 4 4"/><path d="m21 8-4 4"/>',
    link: '<path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
    'qr-code': '<rect x="3" y="3" width="6" height="6"/><rect x="15" y="3" width="6" height="6"/><rect x="3" y="15" width="6" height="6"/><path d="M15 15h2v2h-2z"/><path d="M19 15h2v2h-2z"/><path d="M15 19h2v2h-2z"/><path d="M19 19h2v2h-2z"/>',
    binary: '<rect x="3" y="4" width="7" height="7" rx="1"/><rect x="14" y="13" width="7" height="7" rx="1"/><path d="M17 4h2v7h-2z"/><path d="M5 13h2v7H5z"/>',
    bug: '<path d="M8 2v3"/><path d="M16 2v3"/><path d="M9 7h6a4 4 0 0 1 4 4v4a5 5 0 0 1-10 0v-4a4 4 0 0 1 4-4z"/><path d="M3 13h4"/><path d="M17 13h4"/><path d="m4 7 3 2"/><path d="m20 7-3 2"/><path d="m4 19 3-2"/><path d="m20 19-3-2"/>',
    sort: '<path d="M8 5v14"/><path d="m4 15 4 4 4-4"/><path d="M16 19V5"/><path d="m12 9 4-4 4 4"/>',
    puzzle: '<path d="M19 13h-2a2 2 0 0 1 0-4h2V5h-4a2 2 0 0 0-4 0v2H7a2 2 0 0 0-2 2v4h2a2 2 0 0 1 0 4H5v4h4a2 2 0 0 0 4 0v-2h4a2 2 0 0 0 2-2z"/>',
    wand: '<path d="m15 4 5 5"/><path d="M4 20 17 7"/><path d="m14 6 4 4"/><path d="M6 4v4"/><path d="M4 6h4"/><path d="M19 14v4"/><path d="M17 16h4"/>',
    crown: '<path d="m3 7 4 4 5-7 5 7 4-4v11H3z"/><path d="M3 18h18"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
    'file-code': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m10 13-2 2 2 2"/><path d="m14 13 2 2-2 2"/>',
    'arrow-up-right': '<path d="M7 17 17 7"/><path d="M7 7h10v10"/>',
    'arrow-down-right': '<path d="M7 7l10 10"/><path d="M17 7v10H7"/>',
    minus: '<path d="M5 12h14"/>',
    'more-horizontal': '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    loader: '<path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/>',
    sword: '<path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6"/><path d="m16 16 4 4"/><path d="m19 21 2-2"/>',
  };

  const root = document.body.dataset.root || '';
  const page = document.body.dataset.page || '';
  const layout = document.body.dataset.layout || 'public';
  const isAdmin = document.body.dataset.admin === 'true';

  const navItems = [
    { id: 'accueil', label: 'Accueil', icon: 'home', href: `${root}pages/accueil.html` },
    { id: 'defis', label: 'Défis', icon: 'code', href: `${root}pages/defis.html` },
    { id: 'classements', label: 'Classements', icon: 'trophy', href: `${root}pages/classements.html` },
    { id: 'equipes', label: 'Équipes', icon: 'users', href: `${root}pages/equipes.html` },
    { id: 'evenements', label: 'Événements', icon: 'calendar', href: `${root}pages/evenements.html` },
    { id: 'lore', label: 'Lore', icon: 'book', href: `${root}pages/lore.html` },
    { id: 'boutique', label: 'Boutique', icon: 'cart', href: `${root}pages/boutique.html` },
  ];

  const sidebarGroups = [
    {
      label: 'Jouer',
      items: [
        { id: 'defis', label: 'Défis', icon: 'code', href: `${root}pages/defis.html` },
        { id: 'didacticiels', label: 'Didacticiels', icon: 'book', href: `${root}pages/didacticiel.html` },
        { id: 'evenements', label: 'Événements', icon: 'calendar', href: `${root}pages/evenements.html`, badge: '1' },
        { id: 'boss', label: 'Boss', icon: 'skull', href: `${root}pages/boss.html` },
      ],
    },
    {
      label: 'Progression',
      items: [
        { id: 'classements', label: 'Classements', icon: 'trophy', href: `${root}pages/classements.html` },
        { id: 'lore', label: 'Lore', icon: 'map', href: `${root}pages/lore.html` },
        { id: 'profil', label: 'Profil', icon: 'user', href: `${root}pages/profil.html` },
      ],
    },
    {
      label: 'Social',
      items: [
        { id: 'equipes', label: 'Équipes', icon: 'users', href: `${root}pages/equipes.html` },
        { id: 'chat', label: 'Chat', icon: 'chat', href: `${root}pages/chat.html` },
      ],
    },
    {
      label: 'Économie',
      items: [
        { id: 'boutique', label: 'Boutique', icon: 'cart', href: `${root}pages/boutique.html` },
      ],
    },
  ];

  const icon = (name, cls = '') => {
    const inner = ICONS[name] || ICONS.info;
    return `<span class="icon ${cls}" aria-hidden="true"><svg viewBox="0 0 24 24">${inner}</svg></span>`;
  };

  const hydrateIcons = (scope = document) => {
    scope.querySelectorAll('[data-icon]').forEach((el) => {
      const name = el.dataset.icon;
      if (el.dataset.iconReady === '1') return;
      el.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.info}</svg>`;
      el.dataset.iconReady = '1';
    });
  };

  const active = (id) => {
    const mapped =
      page === id ||
      (page.startsWith('defi-') && id === 'defis') ||
      (page === 'didacticiel' && id === 'didacticiels');
    return mapped ? 'active' : '';
  };
  const ariaCurrent = (id) => (active(id) ? 'aria-current="page"' : '');

  const topbarPublic = () => `
    <div class="topbar-inner">
      <a class="brand" href="${root}pages/accueil.html" aria-label="CodeQuest, accueil">
        <span class="brand-mark">${icon('terminal')}</span>
        <span>Code<span class="brand-dot">Quest</span></span>
      </a>
      <nav class="topnav" aria-label="Navigation principale">
        ${navItems.map((n) => `<a class="nav-link ${active(n.id)}" href="${n.href}" ${ariaCurrent(n.id)}>${n.label}</a>`).join('')}
      </nav>
      <div class="topbar-actions">
        <button class="icon-btn" type="button" data-theme-toggle aria-label="Changer de thème">${icon('moon')}</button>
        <a class="btn btn-ghost btn-sm" href="${root}pages/connexion.html">Connexion</a>
        <a class="btn btn-primary btn-sm" href="${root}pages/inscription.html">Créer un compte</a>
        <button class="icon-btn mobile-toggle" type="button" data-mobile-menu aria-label="Ouvrir le menu" aria-expanded="false">${icon('menu')}</button>
      </div>
    </div>
  `;

  const topbarApp = () => `
    <div class="row" style="gap:10px;min-width:0">
      <button class="icon-btn mobile-toggle" type="button" data-sidebar-toggle aria-label="Ouvrir la navigation" aria-expanded="false">${icon('menu')}</button>
      <div class="breadcrumb">
        <a href="${root}pages/defis.html">CodeQuest</a>
        <span class="sep">/</span>
        <span class="current">${document.body.dataset.title || 'Espace joueur'}</span>
      </div>
    </div>
    <div class="topbar-actions">
      <a class="badge badge-amber" href="${root}pages/boutique.html" title="Solde de Bits">${icon('coin', 'icon-sm')} 1 240 Bits</a>
      <span class="badge badge-red" title="Points de vie">${icon('heart', 'icon-sm')} 86 / 100 PV</span>
      <button class="icon-btn" type="button" data-theme-toggle aria-label="Changer de thème">${icon('moon')}</button>
      <button class="icon-btn" type="button" aria-label="Notifications" data-toast="3 notifications non lues">${icon('bell')}</button>
      <details class="user-menu">
        <summary aria-label="Menu du joueur">
          <span class="avatar">NR</span>
          ${icon('chevron-down', 'icon-sm')}
        </summary>
        <div class="dropdown">
          <a href="${root}pages/profil.html">${icon('user')} Mon profil</a>
          <a href="${root}pages/equipes.html">${icon('users')} Mon équipe</a>
          <a href="${root}pages/profil.html#sessions">${icon('shield')} Sessions</a>
          <div class="dropdown-sep"></div>
          <a href="${root}pages/connexion.html">${icon('logout')} Se déconnecter</a>
        </div>
      </details>
    </div>
  `;

  const sidebar = () => `
    <div class="sidebar-brand">
      <a class="brand" href="${root}pages/accueil.html">
        <span class="brand-mark">${icon('terminal')}</span>
        <span>Code<span class="brand-dot">Quest</span></span>
      </a>
      <button class="icon-btn" type="button" data-sidebar-close aria-label="Fermer la navigation">${icon('x')}</button>
    </div>
    ${sidebarGroups.map((group) => `
      <nav class="sidebar-group" aria-label="${group.label}">
        <span class="sidebar-label">${group.label}</span>
        ${group.items.map((item) => `
          <a class="sidebar-link ${active(item.id)}" href="${item.href}" ${ariaCurrent(item.id)}>
            ${icon(item.icon)}
            <span>${item.label}</span>
            ${item.badge ? `<span class="badge badge-magenta">${item.badge}</span>` : ''}
          </a>
        `).join('')}
      </nav>
    `).join('')}
    ${isAdmin ? `
      <nav class="sidebar-group" aria-label="Administration">
        <span class="sidebar-label">Back-office</span>
        <a class="sidebar-link ${active('admin')}" href="${root}pages/admin.html" ${ariaCurrent('admin')}>${icon('shield-check')}<span>Administration</span></a>
      </nav>
    ` : ''}
    <div class="sidebar-footer">
      <a class="sidebar-user" href="${root}pages/profil.html">
        <span class="avatar">NR</span>
        <span><strong>Nova_Runner</strong><span>Niveau 12 · 2 480 XP</span></span>
      </a>
      <a class="sidebar-link" href="${root}pages/connexion.html">${icon('logout')}<span>Se déconnecter</span></a>
    </div>
  `;

  const footer = () => `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <a class="brand" href="${root}pages/accueil.html">
            <span class="brand-mark">${icon('terminal')}</span>
            <span>Code<span class="brand-dot">Quest</span></span>
          </a>
          <p class="small muted mt-3" style="max-width:300px">Reprends le contrôle du Réseau. Apprends, code, affronte les Gardiens et fais grimper ton équipe au classement.</p>
          <div class="row mt-3">
            <span class="badge badge-cyan">${icon('shield-check', 'icon-sm')} WCAG 2.1 AA</span>
            <span class="badge">${icon('globe', 'icon-sm')} PWA</span>
          </div>
        </div>
        <div class="footer-col">
          <h4>Plateforme</h4>
          <a href="${root}pages/defis.html">Défis</a>
          <a href="${root}pages/didacticiel.html">Didacticiels</a>
          <a href="${root}pages/classements.html">Classements</a>
          <a href="${root}pages/evenements.html">Événements</a>
        </div>
        <div class="footer-col">
          <h4>Univers</h4>
          <a href="${root}pages/lore.html">Lore</a>
          <a href="${root}pages/boss.html">Boss</a>
          <a href="${root}pages/boutique.html">Boutique</a>
          <a href="${root}pages/equipes.html">Équipes</a>
        </div>
        <div class="footer-col">
          <h4>Compte</h4>
          <a href="${root}pages/connexion.html">Connexion</a>
          <a href="${root}pages/inscription.html">Inscription</a>
          <a href="${root}pages/profil.html">Profil &amp; RGPD</a>
          <a href="${root}pages/chat.html">Chat</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© <span data-year>2026</span> CodeQuest — Maquette de démonstration. Données fictives.</span>
        <span class="mono tiny">v1.0 · Spécification fonctionnelle et technique</span>
      </div>
    </div>
  `;

  const renderLayout = () => {
    const topbar = document.querySelector('[data-topbar]');
    if (topbar) topbar.innerHTML = layout === 'app' ? topbarApp() : topbarPublic();

    const sidebarEl = document.querySelector('[data-sidebar]');
    if (sidebarEl) sidebarEl.innerHTML = sidebar();

    const footerEl = document.querySelector('[data-footer]');
    if (footerEl) footerEl.innerHTML = footer();

    document.querySelectorAll('[data-year]').forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  };

  const toast = (message, type = 'info') => {
    let region = document.querySelector('.toast-region');
    if (!region) {
      region = document.createElement('div');
      region.className = 'toast-region';
      region.setAttribute('aria-live', 'polite');
      document.body.appendChild(region);
    }
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    const iconName = type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info';
    el.innerHTML = `${icon(iconName)}<span>${message}</span>`;
    region.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(6px)';
      setTimeout(() => el.remove(), 220);
    }, 4200);
  };

  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      const label = btn.dataset.themeLabel ? `<span>${btn.dataset.themeLabel}</span>` : '';
      btn.innerHTML = icon(theme === 'light' ? 'sun' : 'moon') + label;
      btn.setAttribute('aria-label', theme === 'light' ? 'Passer au thème sombre' : 'Passer au thème clair');
    });
    try { localStorage.setItem('cq-theme', theme); } catch (_) {}
  };

  const initTheme = () => {
    let theme = 'dark';
    try { theme = localStorage.getItem('cq-theme') || 'dark'; } catch (_) {}
    applyTheme(theme);
  };

  const initTabs = () => {
    const openFromHash = () => {
      const id = window.location.hash.replace('#', '');
      if (!id) return;
      const target = document.querySelector(`[role="tab"][aria-controls="${id}"]`);
      if (target) target.click();
    };

    document.querySelectorAll('[data-tab-target]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(`[role="tab"][aria-controls="${link.dataset.tabTarget}"]`);
        if (target) target.click();
      });
    });

    window.addEventListener('hashchange', openFromHash);

    document.querySelectorAll('[data-tabs]').forEach((group) => {
      const tabs = [...group.querySelectorAll('[role="tab"]')];
      const panels = [...group.querySelectorAll('[role="tabpanel"]')];
      tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          tabs.forEach((t) => t.setAttribute('aria-selected', 'false'));
          panels.forEach((p) => { p.hidden = true; });
          tab.setAttribute('aria-selected', 'true');
          const panel = group.querySelector(`#${tab.getAttribute('aria-controls')}`);
          if (panel) panel.hidden = false;
        });
        tab.addEventListener('keydown', (e) => {
          const i = tabs.indexOf(tab);
          if (e.key === 'ArrowRight') { e.preventDefault(); tabs[(i + 1) % tabs.length].focus(); tabs[(i + 1) % tabs.length].click(); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); tabs[(i - 1 + tabs.length) % tabs.length].focus(); tabs[(i - 1 + tabs.length) % tabs.length].click(); }
        });
      });
    });

    openFromHash();
  };

  const initPasswordToggles = () => {
    document.querySelectorAll('[data-password-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.passwordToggle);
        if (!input) return;
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.innerHTML = show ? icon('eye-off') : icon('eye');
        btn.setAttribute('aria-label', show ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
      });
    });
  };

  const initCopy = () => {
    document.querySelectorAll('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const value = btn.dataset.copy;
        try {
          await navigator.clipboard.writeText(value);
          toast('Copié dans le presse-papiers.', 'success');
        } catch (_) {
          toast('Copie indisponible dans cet aperçu.', 'error');
        }
      });
    });
  };

  const initDemoForms = () => {
    document.querySelectorAll('[data-demo-form]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = form.dataset.toast || 'Action simulée dans la maquette.';
        toast(message, form.dataset.toastType || 'success');
        const target = form.dataset.successTarget;
        if (target) {
          const el = document.querySelector(target);
          if (el) el.hidden = false;
        }
      });
    });
  };

  const initModals = () => {
    const focusableSelector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    let lastFocus = null;

    const openModal = (modal, trigger) => {
      lastFocus = trigger || document.activeElement;
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      const focusable = [...modal.querySelectorAll(focusableSelector)].filter((el) => el.offsetParent !== null);
      (focusable[0] || modal).focus();
    };

    const closeModal = (modal) => {
      modal.hidden = true;
      document.body.style.overflow = '';
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
      lastFocus = null;
    };

    document.querySelectorAll('[data-modal-open]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const modal = document.getElementById(btn.dataset.modalOpen);
        if (modal) openModal(modal, btn);
      });
    });
    document.querySelectorAll('[data-modal-close]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-backdrop');
        if (modal) closeModal(modal);
      });
    });
    document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal(backdrop);
      });
    });

    document.addEventListener('keydown', (e) => {
      const modal = [...document.querySelectorAll('.modal-backdrop')].find((m) => !m.hidden);
      if (!modal) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal(modal);
        return;
      }
      if (e.key !== 'Tab') return;
      const focusable = [...modal.querySelectorAll(focusableSelector)].filter((el) => el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    document.querySelectorAll('[data-requires-ack]').forEach((btn) => {
      const ack = document.getElementById(btn.dataset.requiresAck);
      if (!ack) return;
      btn.disabled = !ack.checked;
      ack.addEventListener('change', () => { btn.disabled = !ack.checked; });
    });
  };

  const initCountdowns = () => {
    document.querySelectorAll('[data-countdown]').forEach((el) => {
      let seconds = Number(el.dataset.countdown || 0);
      const render = () => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        el.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        el.closest('.timer')?.classList.toggle('urgent', seconds <= 300);
        if (seconds > 0) seconds -= 1;
      };
      render();
      setInterval(render, 1000);
    });
  };

  const initEditors = () => {
    document.querySelectorAll('[data-editor]').forEach((editor) => {
      const area = editor.querySelector('[data-code-input]');
      const lines = editor.querySelector('[data-line-numbers]');
      if (!area || !lines) return;
      const updateLines = () => {
        const count = Math.max(12, area.value.split('\n').length);
        lines.innerHTML = Array.from({ length: count }, (_, i) => i + 1).join('<br>');
      };
      area.addEventListener('input', updateLines);
      updateLines();
    });

    document.querySelectorAll('[data-run]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const scope = btn.closest('[data-workspace]') || document;
        const consoleEl = scope.querySelector('[data-console]');
        const tests = [...scope.querySelectorAll('[data-test]')];
        const result = scope.querySelector('[data-run-result]');
        if (consoleEl) {
          consoleEl.innerHTML = `
            <div class="console-line"><span class="console-time">[run]</span><span class="terminal-dim">Compilation et exécution dans le bac à sable…</span></div>
            <div class="console-line"><span class="console-time">[run]</span><span>5 exécutions · médiane retenue · temps CPU</span></div>
            <div class="console-line"><span class="console-time">[run]</span><span class="terminal-ok">✓ 5/5 tests passés</span></div>
            <div class="console-line"><span class="console-time">[run]</span><span class="terminal-dim">Score potentiel : 320 pts (base 300 + perf 20)</span></div>
          `;
        }
        tests.forEach((t) => { t.classList.remove('fail'); t.classList.add('pass'); t.querySelector('[data-test-icon]')?.replaceChildren(); });
        if (result) {
          result.hidden = false;
          result.innerHTML = `<div class="alert alert-lime">${icon('check-circle')} <span><strong>5/5 tests passés.</strong> Score potentiel : 320 pts. La soumission officielle reste à confirmer.</span></div>`;
        }
        toast('Exécution simulée : 5/5 tests passés.', 'success');
      });
    });

    document.querySelectorAll('[data-submit]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const scope = btn.closest('[data-workspace]') || document;
        const result = scope.querySelector('[data-submit-result]');
        if (result) {
          result.hidden = false;
          result.innerHTML = `<div class="alert alert-cyan">${icon('trophy')} <span><strong>Soumission enregistrée.</strong> 320 pts · rang 14 sur ce défi · meilleur score personnel mis à jour.</span></div>`;
        }
        toast('Soumission simulée et enregistrée.', 'success');
      });
    });
  };

  const initChallengeFilters = () => {
    const search = document.querySelector('[data-challenge-search]');
    const cards = [...document.querySelectorAll('[data-challenge-card]')];
    if (!cards.length) return;
    const chips = [...document.querySelectorAll('[data-filter-key]')];
    const state = { theme: 'all', difficulty: 'all', status: 'all', type: 'all', q: '' };

    const apply = () => {
      cards.forEach((card) => {
        const show =
          (state.theme === 'all' || card.dataset.theme === state.theme) &&
          (state.difficulty === 'all' || card.dataset.difficulty === state.difficulty) &&
          (state.status === 'all' || card.dataset.status === state.status) &&
          (state.type === 'all' || card.dataset.type === state.type) &&
          (!state.q || card.textContent.toLowerCase().includes(state.q.toLowerCase()));
        card.hidden = !show;
      });
      const visible = cards.filter((c) => !c.hidden).length;
      const count = document.querySelector('[data-challenge-count]');
      if (count) count.textContent = visible;
    };

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const key = chip.dataset.filterKey;
        const value = chip.dataset.filterValue;
        state[key] = value;
        document.querySelectorAll(`[data-filter-key="${key}"]`).forEach((c) => c.classList.toggle('active', c === chip));
        apply();
      });
    });

    search?.addEventListener('input', (e) => { state.q = e.target.value; apply(); });
    apply();
  };

  const initChat = () => {
    document.querySelectorAll('[data-chat-form]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input');
        const messages = document.querySelector('[data-chat-messages]');
        if (!input || !messages || !input.value.trim()) return;
        const el = document.createElement('div');
        el.className = 'message self';
        el.innerHTML = `<span class="avatar">NR</span><div class="message-body"><div class="message-head"><strong>Nova_Runner</strong><time>à l'instant</time></div><p class="message-text"></p></div>`;
        el.querySelector('.message-text').textContent = input.value.trim();
        messages.appendChild(el);
        input.value = '';
        messages.scrollTop = messages.scrollHeight;
      });
    });
  };

  const initSidebar = () => {
    const sidebarEl = document.querySelector('[data-sidebar]');
    const toggle = document.querySelector('[data-sidebar-toggle]');
    const close = document.querySelector('[data-sidebar-close]');
    if (!sidebarEl) return;
    const setOpen = (open) => {
      sidebarEl.classList.toggle('open', open);
      toggle?.setAttribute('aria-expanded', String(open));
    };
    toggle?.addEventListener('click', () => setOpen(!sidebarEl.classList.contains('open')));
    close?.addEventListener('click', () => setOpen(false));
    document.addEventListener('click', (e) => {
      if (window.innerWidth > 1024 || !sidebarEl.classList.contains('open')) return;
      if (!sidebarEl.contains(e.target) && !toggle?.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  };

  const initMobileMenu = () => {
    const btn = document.querySelector('[data-mobile-menu]');
    const nav = document.querySelector('.topnav');
    if (!btn || !nav) return;
    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('mobile-open');
      btn.setAttribute('aria-expanded', String(open));
      btn.innerHTML = open ? icon('x') : icon('menu');
    });
  };

  const initToasts = () => {
    document.querySelectorAll('[data-toast]').forEach((el) => {
      el.addEventListener('click', (e) => {
        if (el.tagName === 'A' && el.getAttribute('href')) return;
        e.preventDefault();
        toast(el.dataset.toast, el.dataset.toastType || 'info');
      });
    });
  };

  const init = () => {
    renderLayout();
    hydrateIcons();
    initTheme();
    initTabs();
    initPasswordToggles();
    initCopy();
    initDemoForms();
    initModals();
    initCountdowns();
    initEditors();
    initChallengeFilters();
    initChat();
    initSidebar();
    initMobileMenu();
    initToasts();
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.dataset.theme || 'dark';
        applyTheme(current === 'light' ? 'dark' : 'light');
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
