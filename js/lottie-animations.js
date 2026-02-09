// Sequential Lottie Animations in Footer Globe - Continuous gapless loop at 4x speed
(function () {
    const lottieAnimations = [
        // Original globe/handshaking animation - keep it first
        'https://lottie.host/41077101-c549-437c-9866-9b60eb1b5f68/fGmXkVZbE6.lottie',
        // New animations
        'https://lottie.host/4228b538-9982-427a-ad33-35d7d8a7312c/grCYUcPoil.lottie',
        'https://lottie.host/86d28ba8-5f60-476e-ba37-02e1a3279c73/1014UhPCtT.lottie',
        'https://lottie.host/1309e337-b64d-4537-98ee-f8db7f042d25/8lUVp4SvJj.lottie',
        'https://lottie.host/a1d3d7e9-8ce6-4672-9e04-0172bf1ac882/Hzx76wUPhG.lottie',
        'https://lottie.host/4259dfdf-2806-4609-baba-5badfce8043a/RhX58kLWta.lottie'
    ];

    let currentIndex = 0;
    let footerGlobeCol = null;

    // Detect when an animation is done
    function onAnimationComplete() {
        currentIndex = (currentIndex + 1) % lottieAnimations.length;
        playNextAnimation();
    }

    // Wait for page to fully load
    window.addEventListener('load', function () {
        footerGlobeCol = document.querySelector('.footer-globe-col');

        if (!footerGlobeCol) return;

        // Start playing animations after a short delay to ensure everything is ready
        setTimeout(playNextAnimation, 500);
    });

    function playNextAnimation() {
        if (!footerGlobeCol) return;

        // Create new dotlottie element
        const lottieElement = document.createElement('dotlottie-wc');
        lottieElement.src = lottieAnimations[currentIndex];
        lottieElement.autoplay = true;
        lottieElement.speed = 4; // Set speed to 4x
        lottieElement.style.cssText = 'width: 300px; height: 300px; display: block;';

        // Clear and add new animation
        footerGlobeCol.innerHTML = '';
        footerGlobeCol.appendChild(lottieElement);

        // Try to listen for the complete event for a truly gapless transition
        lottieElement.addEventListener('complete', onAnimationComplete);

        // Fallback: If 'complete' doesn't fire
        // 1.5s is safe for 4x speed as most animations will take < 1s
        const fallbackTimeout = setTimeout(() => {
            lottieElement.removeEventListener('complete', onAnimationComplete);
            onAnimationComplete();
        }, 1500);

        // Clear fallback if complete fires
        lottieElement.addEventListener('complete', () => clearTimeout(fallbackTimeout), { once: true });
    }
})();
