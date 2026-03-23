(function () {
	var FAVOR_KEY = 'loveheart_favor';
	var defaultFavor = 100;

	function getFavor() {
		var v = localStorage.getItem(FAVOR_KEY);
		return v != null ? parseInt(v, 10) : defaultFavor;
	}

	var extraLineHtml = '好<span class="text-pink">喜欢</span>你好<span class="text-pink">喜欢</span>你好<span class="text-pink">喜欢</span>你好<span class="text-pink">喜欢</span>你好<span class="text-pink">喜欢</span>你好<span class="text-pink">喜欢</span>你呀！';
	var displayedExtraCount = 0;
	var animating = false;

	function updateExtraLines(num) {
		var count = num >= 200 ? Math.floor((num - 100) / 100) : 0;
		if (count <= displayedExtraCount) return;
		animating = true;
		function addNext() {
			if (displayedExtraCount >= count) {
				animating = false;
				return;
			}
			var line = $('<span class="extra-line">' + extraLineHtml + '</span>');
			$("#extraFavorLines").append(line);
			displayedExtraCount++;
			setTimeout(addNext, 500);
		}
		addNext();
	}

	function setFavor(num) {
		localStorage.setItem(FAVOR_KEY, String(num));
		$("#favorNum").text(num);
		updateExtraLines(num);
	}

	var colors = ['#e91e63','#f44336','#ff5722','#ff9800','#ffeb3b','#8bc34a','#4caf50','#00bcd4','#2196f3','#3f51b5','#9c27b0','#e91e8c'];
	function randomColor() {
		return colors[Math.floor(Math.random() * colors.length)];
	}

	function createFlyingHeart(startX, startY, onComplete) {
		var heart = $('<span class="float-heart">❤</span>');
		heart.css({ left: startX + 'px', top: startY + 'px', color: randomColor() });
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
		var overlay = document.getElementById("favorOverlay");
		if (!overlay) return;

		var lastTap = 0;
		function handleTap(x, y) {
			createFlyingHeart(x, y, function () {
				var n = getFavor() + 1;
				setFavor(n);
			});
		}

		function onTap(e) {
			if (Date.now() - lastTap < 200) return;
			lastTap = Date.now();
			var x = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
			var y = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);
			if (e.cancelable) e.preventDefault();
			handleTap(x, y);
		}

		overlay.addEventListener("pointerup", onTap, { passive: false });
		overlay.addEventListener("touchend", onTap, { passive: false });
		overlay.addEventListener("click", onTap);
	});
})();
