// Gallery lightbox: full-screen photos with swipe (scroll-snap), arrow keys,
// Esc and the browser "back" button to close. Without JS the thumbnails
// simply link to the full-size image.
(function () {
    'use strict';

    var gallery = document.querySelector('[data-gallery]');
    var dialog = document.getElementById('lightbox');
    if (!gallery || !dialog || typeof dialog.showModal !== 'function') return;

    var links = Array.prototype.slice.call(gallery.querySelectorAll('a'));
    var track = dialog.querySelector('.lightbox__track');
    var count = dialog.querySelector('.lightbox__count');
    var current = 0;

    var images = links.map(function (link) {
        var slide = document.createElement('figure');
        slide.className = 'lightbox__slide';
        var img = document.createElement('img');
        img.alt = link.querySelector('img').alt;
        img.decoding = 'async';
        slide.appendChild(img);
        track.appendChild(slide);
        return img;
    });

    function load(i) {
        var img = images[i];
        if (img && !img.getAttribute('src')) img.src = links[i].href;
    }

    function setCurrent(i) {
        current = i;
        load(i);
        load(i + 1);
        load(i - 1);
        count.textContent = (i + 1) + ' / ' + images.length;
    }

    function goTo(i, smooth) {
        i = Math.max(0, Math.min(images.length - 1, i));
        track.scrollTo({ left: i * track.clientWidth, behavior: smooth ? 'smooth' : 'auto' });
        setCurrent(i);
    }

    function open(i) {
        document.documentElement.classList.add('has-lightbox');
        dialog.showModal();
        goTo(i, false);
        history.pushState({ lightbox: true }, '');
    }

    function close() {
        // Closing goes through history so that the "back" button and the
        // close button behave the same way.
        if (history.state && history.state.lightbox) history.back();
        else finishClose();
    }

    function finishClose() {
        if (dialog.open) dialog.close();
        document.documentElement.classList.remove('has-lightbox');
        links[current].focus({ preventScroll: true });
        links[current].scrollIntoView({ block: 'nearest' });
    }

    links.forEach(function (link, i) {
        link.addEventListener('click', function (e) {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            open(i);
        });
    });

    var pending = false;
    track.addEventListener('scroll', function () {
        if (pending) return;
        pending = true;
        requestAnimationFrame(function () {
            pending = false;
            var i = Math.round(track.scrollLeft / track.clientWidth);
            if (i !== current && i >= 0 && i < images.length) setCurrent(i);
        });
    }, { passive: true });

    dialog.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            goTo(current + 1, true);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goTo(current - 1, true);
        }
    });

    // Esc
    dialog.addEventListener('cancel', function (e) {
        e.preventDefault();
        close();
    });

    // Tapping the dark area around a photo closes it
    track.addEventListener('click', function (e) {
        if (e.target.tagName !== 'IMG') close();
    });

    dialog.querySelector('.lightbox__close').addEventListener('click', close);
    dialog.querySelector('.lightbox__nav--prev').addEventListener('click', function () {
        goTo(current - 1, true);
    });
    dialog.querySelector('.lightbox__nav--next').addEventListener('click', function () {
        goTo(current + 1, true);
    });

    window.addEventListener('popstate', function () {
        if (dialog.open) finishClose();
    });

    window.addEventListener('resize', function () {
        if (dialog.open) track.scrollTo({ left: current * track.clientWidth });
    });
})();

// Notiziario (page + home): appointments that are already over move to "Già
// svolti" (or disappear from the home), even if the site was published days ago.
(function () {
    'use strict';

    var now = new Date();
    var today = now.getFullYear() + '-' +
        ('0' + (now.getMonth() + 1)).slice(-2) + '-' +
        ('0' + now.getDate()).slice(-2);
    var past = document.querySelector('[data-events="past"]');

    Array.prototype.forEach.call(document.querySelectorAll('[data-events="upcoming"]'), function (list) {
        Array.prototype.slice.call(list.children).forEach(function (item) {
            if (item.getAttribute('data-fine') >= today) return;
            if (past) past.insertBefore(item, past.firstChild);
            else list.removeChild(item);
        });
        var empty = list.parentNode.querySelector('.events__empty');
        if (empty && !list.children.length) empty.hidden = false;
    });

    if (past && past.children.length) {
        past.closest('[data-past-section]').hidden = false;
    }

    Array.prototype.forEach.call(document.querySelectorAll('[data-print]'), function (button) {
        button.addEventListener('click', function () {
            window.print();
        });
    });
})();

// Pages stamped with data-versione (home, notiziario) check that they are the
// latest published version and reload if the browser is showing an old copy:
// a cached page, or a tab left open since before the last update.
(function () {
    'use strict';

    var version = document.documentElement.getAttribute('data-versione');
    if (!version || !window.fetch) return;
    var lastCheck = 0;

    function check() {
        if (Date.now() - lastCheck < 60000) return;
        lastCheck = Date.now();
        fetch('/versione.json', { cache: 'no-store' })
            .then(function (response) {
                return response.ok ? response.json() : null;
            })
            .then(function (data) {
                if (!data || !data.versione || data.versione === version) return;
                var url = new URL(location.href);
                if (url.searchParams.get('v') === data.versione) return; // already tried
                url.searchParams.set('v', data.versione);
                location.replace(url.toString());
            })
            .catch(function () {});
    }

    check();
    window.addEventListener('pageshow', function (e) {
        if (e.persisted) {
            lastCheck = 0;
            check();
        }
    });
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') check();
    });
})();
