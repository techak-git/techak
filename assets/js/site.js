function toggleMenu() {
	const navMenu = document.querySelector('.site-nav');
	const menuToggle = document.querySelector('.nav-menu-toggle');
	const navSearch = document.querySelector('.nav-search');
	const searchToggle = document.querySelector('.nav-search-toggle');

	if (!navMenu || !menuToggle) {
		return;
	}

	if (navSearch && navSearch.classList.contains('active')) {
		navSearch.classList.remove('active');
		if (searchToggle) {
			searchToggle.style.display = 'inline-flex';
		}
	}

	const isActive = navMenu.classList.toggle('active');
	menuToggle.classList.toggle('active', isActive);
	menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
}

function initializeSiteHeader() {
	const siteHeader = document.querySelector('.site-header');
	const navMenu = document.querySelector('.site-nav');
	const menuToggle = document.querySelector('.nav-menu-toggle');
	const searchToggle = document.querySelector('.nav-search-toggle');
	const navSearch = document.querySelector('.nav-search');
	let lastScrollY = window.scrollY;

	if (!siteHeader || !navMenu || !menuToggle) {
		return;
	}

	if (siteHeader.dataset.headerInitialized === 'true') {
		return;
	}

	siteHeader.dataset.headerInitialized = 'true';

	function syncCompactHeader() {
		if (window.innerWidth > 860) {
			siteHeader.classList.remove('is-compact');
			return;
		}

		const currentScrollY = window.scrollY;
		const isScrollingUp = currentScrollY < lastScrollY;
		const shouldCompact = isScrollingUp;

		siteHeader.classList.toggle('is-compact', shouldCompact);
		lastScrollY = currentScrollY;
	}

	document.addEventListener('click', function(event) {
		if (window.innerWidth > 860) {
			return;
		}

		if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
			navMenu.classList.remove('active');
			menuToggle.classList.remove('active');
			menuToggle.setAttribute('aria-expanded', 'false');
		}
	});

	window.addEventListener('scroll', function() {
		syncCompactHeader();

		if (!siteHeader.classList.contains('is-compact')) {
			return;
		}

		if (navMenu.classList.contains('active')) {
			navMenu.classList.remove('active');
			menuToggle.classList.remove('active');
			menuToggle.setAttribute('aria-expanded', 'false');
		}

		if (navSearch && navSearch.classList.contains('active')) {
			navSearch.classList.remove('active');
			if (searchToggle) {
				searchToggle.style.display = 'inline-flex';
			}
		}
	});

	window.addEventListener('resize', function() {
		if (window.innerWidth > 860) {
			navMenu.classList.remove('active');
			menuToggle.classList.remove('active');
			menuToggle.setAttribute('aria-expanded', 'false');
		}

		syncCompactHeader();
	});

	syncCompactHeader();
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initializeSiteHeader);
} else {
	initializeSiteHeader();
}