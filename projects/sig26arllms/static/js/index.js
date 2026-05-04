window.HELP_IMPROVE_VIDEOJS = false;


$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var teaserVideo = document.getElementById('tree');
    if (teaserVideo) {
        teaserVideo.playbackRate = 0.5;
    }

    var options = {
			slidesToScroll: 1,
			slidesToShow: 1,
			loop: true,
			infinite: true,
			autoplay: true,
			autoplaySpeed: 5000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
	
    bulmaSlider.attach();

    $('.media-showcase .image').each(function() {
        var videos = $(this).find('video');

        if (videos.length < 2) {
            return;
        }

        var container = $(this);
        var currentIndex = 0;
        var controls = $('<div class="media-carousel-controls"></div>');
        var prevButton = $('<button type="button" class="media-carousel-button is-prev" aria-label="Previous video">&#10094;</button>');
        var nextButton = $('<button type="button" class="media-carousel-button is-next" aria-label="Next video">&#10095;</button>');
        var dots = $('<div class="media-carousel-dots"></div>');

        container.addClass('media-carousel');
        controls.append(prevButton, nextButton);
        container.append(controls);

        videos.each(function(index) {
            this.loop = false;
            this.currentTime = 0;
            this.controls = false;
            this.hidden = false;
            $(this).toggle(index === 0);
            $(this).addClass('media-carousel-slide');

            var dot = $('<button type="button" class="media-carousel-dot" aria-label="Show video ' + (index + 1) + '"></button>');
            dot.on('click', function() {
                playVideoAt(index);
            });
            dots.append(dot);
        });

        container.append(dots);

        function playVideoAt(index) {
            currentIndex = index;

            videos.each(function(videoIndex) {
                var isActive = videoIndex === index;
                this.hidden = false;
                $(this).toggle(isActive);
                $(this).toggleClass('is-active', isActive);

                if (!isActive) {
                    this.pause();
                    this.currentTime = 0;
                }
            });

            dots.find('.media-carousel-dot').each(function(dotIndex) {
                $(this).toggleClass('is-active', dotIndex === index);
            });

            var activeVideo = videos.get(index);
            if (!activeVideo) {
                return;
            }

            activeVideo.currentTime = 0;
            var playPromise = activeVideo.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function() {});
            }
        }

        videos.each(function(index) {
            this.addEventListener('ended', function() {
                var nextIndex = (index + 1) % videos.length;
                playVideoAt(nextIndex);
            });
        });

        prevButton.on('click', function() {
            var nextIndex = (currentIndex - 1 + videos.length) % videos.length;
            playVideoAt(nextIndex);
        });

        nextButton.on('click', function() {
            var nextIndex = (currentIndex + 1) % videos.length;
            playVideoAt(nextIndex);
        });

        playVideoAt(0);
    });

    var lightbox = $('#image-lightbox');
    var lightboxTarget = $('#image-lightbox-target');

    function closeLightbox() {
        lightbox.removeClass('is-active').attr('aria-hidden', 'true');
        lightboxTarget.attr('src', '');
    }

    $('.mixed-media-gallery .gallery-card-media img').on('click', function() {
        var src = $(this).attr('src');
        var alt = $(this).attr('alt') || 'Expanded figure';

        if (!src) {
            return;
        }

        lightboxTarget.attr({
            src: src,
            alt: alt
        });
        lightbox.addClass('is-active').attr('aria-hidden', 'false');
    });

    $('.image-lightbox-close, .image-lightbox-backdrop').on('click', function() {
        closeLightbox();
    });

    $(document).on('keydown', function(event) {
        if (event.key === 'Escape' && lightbox.hasClass('is-active')) {
            closeLightbox();
        }
    });

})
