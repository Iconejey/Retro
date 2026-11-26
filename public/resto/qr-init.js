document.addEventListener('DOMContentLoaded', () => {
	const qrImages = document.querySelectorAll('img.qr');

	qrImages.forEach(qrImg => {
		const qrUrl = encodeURI(qrImg.getAttribute('target'));
		if (qrUrl) {
			const qr = new QRCode(qrUrl, {
				typeNumber: -1,
				errorCorrectionLevel: 'M',
				size: 400,
				margin: 0
			});
			qrImg.src = qr.toDataURL();
			qrImg.alt = `QR Code - ${qrUrl}`;
		}
	});
});
