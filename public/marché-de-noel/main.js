function emojiBg(fragX, fragY) {
	const emojis = ['🍁', '🍂', '🎄', '✨', '🎀', '🎁', '⭐', '🔔', '🕯️', '❄️', '☃️', '🦌', '🛷', '🎊', '🍪', '🥛', '🌟'];

	for (let i = 0; i < fragX; i++) {
		for (let j = 0; j < fragY; j++) {
			const emoji = emojis[Math.floor(Math.random() * emojis.length)];
			const span = create`<span class="emoji hidden">${emoji}</span>`;

			const off = 5 / 100;

			const x = (innerWidth / fragX) * i + Math.random() * (off - off / 2) * innerWidth;
			const y = (innerHeight / fragY) * j + Math.random() * (off - off / 2) * innerHeight;

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
	if (e.key === '&') emojiBg(16, 10);
});

window.addEventListener('load', () => {
	if (innerWidth < 600) emojiBg(5, 8);

	// Initialize socket.io connection for real-time vote updates
	const socket = io();

	// Listen for vote updates
	socket.on('voteUpdate', data => {
		// Store the updated vote counts
		socket.voteData[data.name] = data.counts;
		updateVoteDisplay(data.name, data.total);
	});

	// Listen for all vote counts when connecting
	socket.on('allVoteCounts', allCounts => {
		// Store all vote data
		socket.voteData = allCounts;

		for (const voteName in allCounts) {
			const total = Object.values(allCounts[voteName]).reduce((sum, count) => sum + count, 0);
			updateVoteDisplay(voteName, total);
		}
	});

	// Function to update vote display in the UI
	function updateVoteDisplay(voteName, totalVotes) {
		// Find the QR code element that targets the vote
		const qrElement = document.querySelector(`img.qr[target*="name=${voteName}"]`);
		if (qrElement) {
			// Find the vote count paragraph next to the QR code
			const voteCountElement = qrElement.nextElementSibling;
			if (voteCountElement && voteCountElement.classList.contains('op')) {
				voteCountElement.textContent = `${totalVotes} vote${totalVotes !== 1 ? 's' : ''}`;
			}
		}

		// Update results slide if it exists
		updateResultsDisplay(voteName);
	}

	// Function to update the results slide
	async function updateResultsDisplay(voteName) {
		const resultsContainer = document.querySelector(`.results-container[data-vote-name="${voteName}"]`);
		if (!resultsContainer) return;

		const optionsContainer = resultsContainer.$('.options');
		const totalVotesElement = resultsContainer.$('.total-votes');

		// Get the current vote data from server storage
		const currentVoteData = socket.voteData || {};
		const voteResults = currentVoteData[voteName] || {};

		// Calculate total votes
		const totalVotes = Object.values(voteResults).reduce((sum, count) => sum + count, 0);

		// Update total votes display
		totalVotesElement.textContent = `${totalVotes} vote${totalVotes !== 1 ? 's' : ''} au total`;

		// Clear existing options
		optionsContainer.innerHTML = '';

		// Sort results by vote count (highest first)
		const sortedResults = Object.entries(voteResults).sort((a, b) => b[1] - a[1]);

		// Display each option with its vote count
		for (const [option, count] of sortedResults) {
			const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
			optionsContainer.appendr`
				<div class="option result-option">
					<div class="progress-bg" style="width: ${percentage}%;"></div>
					<span class="option-text">${option}</span>
					<span class="vote-count">${count} vote${count !== 1 ? 's' : ''} (${percentage}%)</span>
				</div>
			`;
		}
	}

	// Store vote data locally for results display
	socket.voteData = {};
});
