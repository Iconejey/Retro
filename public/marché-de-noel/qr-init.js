/**
 * QR Code Initialization for Ice Breaker Slide
 * Generates QR code on page load and populates the img element
 */

document.addEventListener('DOMContentLoaded', () => {
    // URL to encode in the QR code
    const qrUrl = 'https://retro.nosuite.fr/marché-de-noel/vote?name=icebreaker';
    
    // Find the QR code image element
    const qrImg = document.querySelector('img.qr');
    
    if (qrImg) {
        try {
            // Generate QR code
            const qr = new QRCode(qrUrl, {
                typeNumber: -1,  // Auto-detect best type
                errorCorrectionLevel: 'M',  // Medium error correction
                size: 256,  // Size in pixels
                margin: 4  // Margin in modules
            });
            
            // Set the image source to the generated QR code data URI
            qrImg.src = qr.toDataURL();
            qrImg.alt = 'QR Code - Vote pour Ice breaker';
        } catch (error) {
            console.error('Failed to generate QR code:', error);
        }
    }
});
