function emojiBg() {
	const emojis = ['🍁', '🍂', '🎄', '✨', '🎀', '🎁', '⭐', '🔔', '🕯️', '❄️', '☃️', '🦌', '🛷', '🎊', '🍪', '🥛', '🌟'];

	const fragX = 16;
	const fragY = 10;

	for (let i = 0; i < fragX; i++) {
		for (let j = 0; j < fragY; j++) {
			const emoji = emojis[Math.floor(Math.random() * emojis.length)];
			const span = create`<span class="emoji hidden">${emoji}</span>`;

			const off = (innerHeight / 100) * 5;

			const x = (innerWidth / fragX) * i + Math.random() * off - off / 2;
			const y = (innerHeight / fragY) * j + Math.random() * off - off / 2;

			const r = Math.random() * 180 - 90;
			const reverse = Math.random() < 0.5;

			span.styler.attr`
                left: ${x}px;
                top: ${y}px;
                transform: rotate(${r}deg);
                animation-direction: ${reverse ? 'reverse' : 'normal'};
            `;

			document.body.appendChild(span);
			setTimeout(() => span.classList.remove('hidden'), Math.random() * 3000);
		}
	}
}

window.addEventListener('keydown', e => {
	if (e.key === '&') emojiBg();
});
