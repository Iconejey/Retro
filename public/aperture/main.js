const slideAudios = ['./mp3/diapo 01.mp3', './mp3/diapo 02.mp3', './mp3/diapo 03.mp3', './mp3/diapo 04.mp3', './mp3/diapo 05.mp3', './mp3/diapo 06.mp3'];

let currentAudio = null;
let unlocked = false;

function stopCurrentAudio() {
	if (!currentAudio) return;
	currentAudio.pause();
	currentAudio.currentTime = 0;
	currentAudio = null;
}

function playAudioForSlide(index) {
	const audioPath = slideAudios[index - 1];
	stopCurrentAudio();

	if (!audioPath || !unlocked) return;

	currentAudio = new Audio(audioPath);
	currentAudio.play().catch(() => {
		currentAudio = null;
	});
}

document.addEventListener(
	'keydown',
	() => {
		if (!unlocked) {
			unlocked = true;
			const activeSlideIndex = Array.from(document.querySelectorAll('.slide')).findIndex(slide => slide.style.display === 'flex');
			if (activeSlideIndex >= 0) {
				playAudioForSlide(activeSlideIndex);
			}
		}
	},
	{ once: true }
);

document.addEventListener('slideChanged', event => {
	document.body.classList.toggle('intro-slide', event.detail.currentSlide === 0);
	playAudioForSlide(event.detail.currentSlide);
});

window.addEventListener('beforeunload', stopCurrentAudio);
