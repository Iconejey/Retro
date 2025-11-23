async function initVote() {
	const url_params = new URLSearchParams(window.location.search);
	const name = url_params.get('name');
	const vote_data_res = await fetch(`./${name}.json`);
	const vote_data = await vote_data_res.json();

	document.body.appendr`
        <p>${vote_data.title}</p>
        <div class="options"></div>
    `;

	const options = $('.options');

	for (const option of vote_data.options) {
		const option_elem = create`<span class="option">${option}</span>`;
		options.appendChild(option_elem);
		option_elem.onclick = () => {
			options.$('.selected')?.classList.remove('selected');
			option_elem.classList.add('selected');
		};
	}

	options.appendr`
        <input class="option" type="text" placeholder="Votre propre réponse..." />
        <button class="submit">Voter</button>
    `;

	$('input').onclick = () => {
		options.$('.selected')?.classList.remove('selected');
		$('input').classList.add('selected');
	};

	$('.submit').onclick = async () => {
		const option = options.$('.option.selected') || options.$('input');
		const value = option.value || option.textContent;
		if (!value) return;

		await fetch('/submit', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name,
				option: value
			})
		});

		$$('body :not(.emoji)').forEach(elem => elem.remove());
		document.body.appendr`<h2>Merci !</h2>`;
	};
}

window.addEventListener('load', initVote);
