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

		$(document).on("click", function (e) {
			if ($(e.target).closest("embed").length) return;
			var x = e.clientX;
			var y = e.clientY;
			createFlyingHeart(x, y, function () {
				var n = getFavor() + 1;
				setFavor(n);
			});
		});
	});
})();
