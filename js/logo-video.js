document.addEventListener('DOMContentLoaded', () => {
    const videos = document.querySelectorAll('.logo-video');
    videos.forEach(video => {
        video.muted = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('autoplay', '');

        // Ensure it plays if autoplay fails
        const promise = video.play();
        if (promise !== undefined) {
            promise.catch(error => {
                // Auto-play was prevented
                console.log("Logo video auto-play prevented, will play on first interaction if needed.");
            });
        }
    });
});
