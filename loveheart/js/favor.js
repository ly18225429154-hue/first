(function () {
	var FAVOR_KEY = 'loveheart_favor';
	var defaultFavor = 100;

	function getFavor() {
		var v = localStorage.getItem(FAVOR_KEY);
		return v != null ? parseInt(v, 10) : defaultFavor;
	}

	function setFavor(num) {
		localStorage.setItem(FAVOR_KEY, String(num));
		$("#favorNum").text(num);
	}

	function createFlyingHeart(startX, startY, onComplete) {
		var heart = $('<span class="float-heart">❤</span>');
		heart.css({ left: startX + 'px', top: startY + 'px' });
		$("body").append(heart);

		var target = $("#favorDisplay")[0];
		if (!target) {
			heart.remove();
			if (onComplete) onComplete();
			return;
		}
		var rect = target.getBoundingClientRect();
		var endX = rect.left + rect.width / 2 - 12;
		var endY = rect.top + rect.height / 2 - 12;

		heart.css({
			transition: 'all 0.6s ease-out',
			left: endX + 'px',
			top: endY + 'px',
			transform: 'scale(0.3)',
			opacity: '0'
		});

		setTimeout(function () {
			heart.remove();
			if (onComplete) onComplete();
		}, 650);
	}

	$(function () {
		setFavor(getFavor());
		var lastTouchTime = 0;

		function handleTap(x, y, target) {
			if (target && ($(target).closest("embed").length || $(target).closest("a").length)) return;
			createFlyingHeart(x, y, function () {
				var n = getFavor() + 1;
				setFavor(n);
			});
		}

		$(document).on("touchend", function (e) {
			if (e.changedTouches && e.changedTouches.length) {
				var t = e.changedTouches[0];
				var target = e.target;
				if (!$(target).closest("a").length) e.preventDefault();
				lastTouchTime = Date.now();
				handleTap(t.clientX, t.clientY, target);
			}
		});

		$(document).on("click", function (e) {
			if (Date.now() - lastTouchTime < 400) return;
			handleTap(e.clientX, e.clientY, e.target);
		});
	});
})();
