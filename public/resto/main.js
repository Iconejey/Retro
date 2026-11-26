document.addEventListener('DOMContentLoaded', () => {
	const socket = io();
	socket.voteData = {};

	socket.on('voteUpdate', data => {
		socket.voteData[data.name] = data.counts;
		updateVoteDisplay(data.name, data.total);
	});

	socket.on('allVoteCounts', allCounts => {
		socket.voteData = allCounts;

		for (const voteName in allCounts) {
			const total = Object.values(allCounts[voteName]).reduce((sum, count) => sum + count, 0);
			updateVoteDisplay(voteName, total);
		}
	});

	function updateVoteDisplay(voteName, totalVotes) {
		const resultsContainer = document.querySelector(`.results-container[data-vote-name="${voteName}"]`);
		if (!resultsContainer) return;

		const optionsContainer = resultsContainer.querySelector('.options');
		const totalVotesElement = resultsContainer.querySelector('.total-votes');
		const voteResults = socket.voteData[voteName] || {};

		if (totalVotesElement) {
			totalVotesElement.textContent = `${totalVotes} vote${totalVotes > 1 ? 's' : ''}`;
		}

		if (optionsContainer) {
			optionsContainer.innerHTML = '';
			const sortedResults = Object.entries(voteResults).sort((a, b) => b[1] - a[1]);

			for (const [option, count] of sortedResults) {
				const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
				const optEl = document.createElement('div');
				optEl.className = 'result-option';

				optEl.innerHTML = `
					<div class="progress-bg" style="width: ${percentage}%;"></div>
					<span class="option-text">${option}</span>
					<span class="vote-count">${count} (${percentage}%)</span>
				`;

				optionsContainer.appendChild(optEl);
			}
		}
	}
});
