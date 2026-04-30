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

function initializeScrollPosition() {
	if ('scrollRestoration' in window.history) {
		window.history.scrollRestoration = 'manual';
	}

	if (window.location.hash) {
		return;
	}

	window.scrollTo(0, 0);
	window.requestAnimationFrame(function() {
		window.scrollTo(0, 0);
	});
}

function initializeScrollEffects() {
	if (document.body.dataset.scrollEffectsInitialized === 'true') {
		return;
	}

	document.body.dataset.scrollEffectsInitialized = 'true';

	const revealSelectors = [
		'.hero-copy > *',
		'.terminal-card',
		'.terminal-body p',
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
		element.style.setProperty('--reveal-delay', `${(index % 6) * 55}ms`);
	});

	elements.forEach(function(element, index) {
		const rect = element.getBoundingClientRect();
		if (index === 0 || (rect.bottom > 0 && rect.top < window.innerHeight)) {
			element.classList.add('is-visible');
		}
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
		const scrollTop = window.scrollY || window.pageYOffset;
		const maxScrollTop = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
		const viewportCenter = window.innerHeight * 0.5;
		let activeElement = null;
		let bestDistance = Number.POSITIVE_INFINITY;
		const visibleElements = elements.filter(function(element) {
			if (!element.classList.contains('is-visible')) {
				return false;
			}

			const rect = element.getBoundingClientRect();
			return rect.bottom > 0 && rect.top < window.innerHeight;
		});

		if (scrollTop <= 12) {
			activeElement = visibleElements[0] || elements[0] || null;
		} else if (maxScrollTop - scrollTop <= 12) {
			activeElement = visibleElements[visibleElements.length - 1] || elements[elements.length - 1] || null;
		}

		if (!activeElement) {
			visibleElements.forEach(function(element) {
				const rect = element.getBoundingClientRect();
				const elementCenter = rect.top + rect.height / 2;
				const distance = Math.abs(elementCenter - viewportCenter);

				if (distance < bestDistance) {
					bestDistance = distance;
					activeElement = element;
				}
			});
		}

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
	requestUpdate();
	window.setTimeout(requestUpdate, 80);
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initializeScrollPosition);
	document.addEventListener('DOMContentLoaded', initializeSiteHeader);
	document.addEventListener('DOMContentLoaded', initializeScrollEffects);
} else {
	initializeScrollPosition();
	initializeSiteHeader();
	initializeScrollEffects();
}