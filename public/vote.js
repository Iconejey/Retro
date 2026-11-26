async function initVote() {
	const url_params = new URLSearchParams(window.location.search);
	const name = url_params.get('name');
	const vote_data_res = await fetch(`./${name}.json`);
	const vote_data = await vote_data_res.json();

	const container = $('.panel') || document.body;

	container.appendr`
        <h2 class="question">${vote_data.title}</h2>
        <div class="options"></div>
    `;

	const options = $('.options');

	for (const option of vote_data.options) {
		const isObj = typeof option === 'object' && option !== null;
		const label = isObj ? option.label || option.title || option.name || option.value : option;
		const desc = isObj ? option.description : null;

		const option_elem = desc
			? create`<div class="option" data-value="${label}">
				<div class="option-title blue">${label}</div>
				<div class="option-desc">${desc}</div>
			</div>`
			: create`<div class="option" data-value="${label}">
				<div class="option-title blue">${label}</div>
			</div>`;

		options.appendChild(option_elem);
		option_elem.onclick = () => {
			options.$('.selected')?.classList.remove('selected');
			option_elem.classList.add('selected');
		};
	}

	options.appendr`
        <input class="option custom-input" type="text" placeholder="Votre propre réponse..." />
        <button class="submit">Voter</button>
    `;

	$('input').onclick = () => {
		options.$('.selected')?.classList.remove('selected');
		$('input').classList.add('selected');
	};

	$('.submit').onclick = async () => {
		const selectedElem = options.$('.option.selected') || options.$('input');
		if (!selectedElem) return;

		const value = selectedElem.dataset?.value || selectedElem.value || selectedElem.textContent;
		if (!value || !value.trim()) return;

		await fetch('/submit', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name,
				option: value.trim()
			})
		});

		if (selectedElem.tagName === 'INPUT') {
			const customOpt = create`<div class="option selected"><div class="option-title blue">${value.trim()}</div></div>`;
			options.replaceChildren(customOpt);
		} else {
			options.replaceChildren(selectedElem);
			selectedElem.onclick = null;
		}

		container.appendr`<h2 class="thank-you">Merci !</h2>`;
	};
}

window.addEventListener('load', initVote);
