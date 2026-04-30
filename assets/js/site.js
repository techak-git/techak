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

	if (!siteHeader || !navMenu || !menuToggle) {
		return;
	}

	if (siteHeader.dataset.headerInitialized === 'true') {
		return;
	}

	siteHeader.dataset.headerInitialized = 'true';

	siteHeader.classList.remove('is-compact');

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

	window.addEventListener('resize', function() {
		siteHeader.classList.remove('is-compact');

		if (window.innerWidth > 860) {
			navMenu.classList.remove('active');
			menuToggle.classList.remove('active');
			menuToggle.setAttribute('aria-expanded', 'false');
		}
	});
}

function initializeScrollEffects() {
	if (document.body.dataset.scrollEffectsInitialized === 'true') {
		return;
	}

	document.body.dataset.scrollEffectsInitialized = 'true';

	const revealSelectors = [
		'.hero-copy > *',
		'.hero-panel',
		'.section-heading',
		'.metric-card',
		'.feature-card',
		'.tip-card',
		'.contact-strip',
		'.profile-hero-main',
		'.profile-side-panel',
		'.content-panel',
		'.stack-panel',
		'.timeline-card',
		'.skill-category',
		'.cert-card',
		'.tutorial-hero',
		'.tutorial-article > *'
	];

	const elements = Array.from(document.querySelectorAll(revealSelectors.join(', ')));

	if (!elements.length) {
		return;
	}

	elements.forEach(function(element, index) {
		element.classList.add('scroll-reveal');
		element.classList.add('scroll-focus-item');
		element.style.setProperty('--reveal-delay', `${(index % 6) * 80}ms`);
	});

	if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		elements.forEach(function(element) {
			element.classList.add('is-visible');
		});
		return;
	}

	const observer = new IntersectionObserver(function(entries, currentObserver) {
		entries.forEach(function(entry) {
			if (!entry.isIntersecting) {
				return;
			}

			entry.target.classList.add('is-visible');
			window.requestAnimationFrame(function() {
				window.dispatchEvent(new Event('scroll'));
			});
			currentObserver.unobserve(entry.target);
		});
	}, {
		threshold: 0.14,
		rootMargin: '0px 0px -10% 0px'
	});

	elements.forEach(function(element) {
		observer.observe(element);
	});

	initializeScrollFocus(elements);
}

function initializeScrollFocus(elements) {
	if (!elements.length) {
		return;
	}

	document.body.classList.add('scroll-focus-enabled');

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		elements.forEach(function(element) {
			element.classList.add('is-active');
		});
		return;
	}

	let ticking = false;

	function updateActiveElement() {
		ticking = false;
		const viewportCenter = window.innerHeight * 0.5;
		let activeElement = null;
		let bestDistance = Number.POSITIVE_INFINITY;

		elements.forEach(function(element) {
			if (!element.classList.contains('is-visible')) {
				return;
			}

			const rect = element.getBoundingClientRect();
			if (rect.bottom <= 0 || rect.top >= window.innerHeight) {
				return;
			}

			const elementCenter = rect.top + rect.height / 2;
			const distance = Math.abs(elementCenter - viewportCenter);

			if (distance < bestDistance) {
				bestDistance = distance;
				activeElement = element;
			}
		});

		elements.forEach(function(element) {
			element.classList.toggle('is-active', element === activeElement);
		});
	}

	function requestUpdate() {
		if (ticking) {
			return;
		}

		ticking = true;
		window.requestAnimationFrame(updateActiveElement);
	}

	window.addEventListener('scroll', requestUpdate, { passive: true });
	window.addEventListener('resize', requestUpdate);
	window.setTimeout(requestUpdate, 120);
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initializeSiteHeader);
	document.addEventListener('DOMContentLoaded', initializeScrollEffects);
} else {
	initializeSiteHeader();
	initializeScrollEffects();
}