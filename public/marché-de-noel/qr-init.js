/**
 * QR Code Initialization for Ice Breaker Slide
 * Generates QR code on page load and populates the img element
 */

document.addEventListener('DOMContentLoaded', () => {
	// Find all QR code image elements
	const qrImages = document.querySelectorAll('img.qr');

	qrImages.forEach(qrImg => {
		// Get the target URL from the target attribute
		const qrUrl = encodeURI(qrImg.getAttribute('target'));

		if (qrUrl) {
			try {
				// Generate QR code
				const qr = new QRCode(qrUrl, {
					typeNumber: -1, // Auto-detect best type
					errorCorrectionLevel: 'M', // Medium error correction
					size: 256, // Size in pixels
					margin: 4 // Margin in modules
				});

				// Set the image source to the generated QR code data URI
				qrImg.src = qr.toDataURL();
				qrImg.alt = `QR Code - ${qrUrl}`;
			} catch (error) {
				console.error(`Failed to generate QR code for ${qrUrl}:`, error);
			}
		} else {
			console.warn('QR image found but no target attribute specified:', qrImg);
		}
	});
});
