import { useEffect, useRef, useState } from 'react';
import '../index1.scss';


const Slideshow = () => {
    const slideshowRef = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(1);
    const [isAnimating, setIsAnimating] = useState(false);
    const [maxSlide, setMaxSlide] = useState(0);
    const animationDuration = 1200;
    const autoplaySpeed = 10000;

    useEffect(() => {
        const handleResize = () => {
            const slides = slideshowRef.current.querySelectorAll('.js-slider-home-slide');
            setMaxSlide(slides.length);
            // Ensure goToSlide only runs if slides exist
            if (slides.length > 0) {
                goToSlide(1);
            }
            addAutoplay();
        };

        handleResize(); //Call on initial render
        window.addEventListener('resize', handleResize); //Listen for resize events

        return () => {
            clearInterval(slideshowRef.current.interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const goToSlide = (index) => {
        const slides = slideshowRef.current.querySelectorAll('.js-slider-home-slide');
        const paginationItems = slideshowRef.current.querySelectorAll('.js-pagination-item');

        if (slides.length === 0) {
            console.error('No slides found in DOM.');
            return;
        }

        let newCurrent = parseInt(index);

        if (newCurrent > maxSlide) newCurrent = 1;
        if (newCurrent <= 0) newCurrent = maxSlide;

        setCurrentSlide(newCurrent);

        slides.forEach((slide) => {
            slide.classList.remove('is-prev', 'is-next', 'is-current');
        });

        if (paginationItems.length > 0) {
            paginationItems.forEach((item) => {
                item.classList.remove('is-current');
            });
        }

        const slide = slideshowRef.current.querySelector(`[data-slide="${newCurrent}"]`);
        if (!slide) {
            console.error(`Slide with index ${newCurrent} not found.`);
            return;
        }

        const current = slides[newCurrent - 1];
        const prev = newCurrent === 1 ? slides[maxSlide - 1] : slides[newCurrent - 2];
        const next = newCurrent === maxSlide ? slides[0] : slides[newCurrent];

        if (maxSlide > 1) {
            prev.classList.add('is-prev');
            next.classList.add('is-next');
        }
        current.classList.add('is-current');
        if (paginationItems.length > 0) {
            paginationItems[newCurrent - 1].classList.add('is-current');
        }
    };

    const preventClick = () => {
        setIsAnimating(true);
        clearInterval(slideshowRef.current.interval);

        setTimeout(() => {
            setIsAnimating(false);
            addAutoplay();
        }, animationDuration);
    };

    const nextSlide = () => {
        if (!isAnimating) {
            preventClick();
            goToSlide(currentSlide + 1);
        }
    };

    const prevSlide = () => {
        if (!isAnimating) {
            preventClick();
            goToSlide(currentSlide - 1);
        }
    };

    const addAutoplay = () => {
        slideshowRef.current.interval = setInterval(() => {
            if (!isAnimating) {
                nextSlide();
            }
        }, autoplaySpeed);
    };

    // const handlePaginationClick = (slide) => {
    //     if (!isAnimating) {
    //         preventClick();
    //         goToSlide(slide);
    //     }
    // };

    return (
        <div id="wrapper" ref={slideshowRef}>
            <section className="slideshow" id="js-header">
                {[1, 2, 3].map((slide, index) => (
                    <div
                        key={index}
                        className={`slideshow__slide js-slider-home-slide ${currentSlide === slide ? 'is-current' : ''
                            }`}
                        data-slide={slide}
                    >
                        <div
                            className="slideshow__slide-background-parallax background-absolute js-parallax"
                            data-speed="-1"
                            data-position="top"
                            data-target="#js-header"
                        >
                            <div className="slideshow__slide-background-load-wrap background-absolute">
                                <div className="slideshow__slide-background-load background-absolute">
                                    <div className="slideshow__slide-background-wrap background-absolute">
                                        <div className="slideshow__slide-background background-absolute">
                                            <div className="slideshow__slide-image-wrap background-absolute">
                                                <div
                                                    className="slideshow__slide-image background-absolute"
                                                    style={{
                                                        backgroundImage: `url(${index === 0
                                                            ? 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg?auto=compress&cs=tinysrgb&h=1080&w=1920'
                                                            : index === 1
                                                                ? 'https://images.pexels.com/photos/110649/pexels-photo-110649.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1080&w=1920'
                                                                : 'https://images.pexels.com/photos/196666/pexels-photo-196666.jpeg?auto=compress&cs=tinysrgb&h=1080&w=1920'
                                                            })`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="slideshow__slide-caption">
                            <div className="slideshow__slide-caption-text">
                                <div
                                    className="container-style js-parallax"
                                    data-speed="2"
                                    data-position="top"
                                    data-target="#js-header"
                                >
                                    <h1 className="slideshow__slide-caption-title">
                                        {index === 0
                                            ? 'Everything broken can be repaired'
                                            : index === 1
                                                ? 'See through the field'
                                                : 'Hey, take a time to relax!'}
                                    </h1>
                                    <a
                                        className="slideshow__slide-caption-subtitle -load o-hsub -link"
                                        href="#"
                                    >
                                        <span className="slideshow__slide-caption-subtitle-label">
                                            {index === 0
                                                ? 'See how'
                                                : index === 1
                                                    ? 'Learn more about'
                                                    : 'Everybody needs'}
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="c-header-home_footer">
                    <div className="o-container">
                        <div className="c-header-home_controls -nomobile o-button-group">
                            <div className="js-parallax is-inview" data-speed="1" data-position="top" data-target="#js-header">
                                <button
                                    className="o-button -white -square -left js-slider-home-button js-slider-home-prev"
                                    type="button"
                                    onClick={prevSlide}
                                >
                                    <span className="o-button_label">
                                        <svg className="o-button_icon" role="img">
                                            <use xlinkHref="#arrow-prev"></use>
                                        </svg>
                                    </span>
                                </button>
                                <button
                                    className="o-button -white -square js-slider-home-button js-slider-home-next"
                                    type="button"
                                    onClick={nextSlide}
                                >
                                    <span className="o-button_label">
                                        <svg className="o-button_icon" role="img">
                                            <use xlinkHref="#arrow-next"></use>
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <svg xmlns="http://www.w3.org/2000/svg">
                <symbol viewBox="0 0 18 18" id="arrow-next">
                    <path d="M12.6,9L4,17.3L4.7,18l8.5-8.3l0,0L14,9l0,0l-0.7-0.7l0,0L4.7,0L4,0.7L12.6,9z" />
                </symbol>
                <symbol viewBox="0 0 18 18" id="arrow-prev">
                    <path d="M14,0.7L13.3,0L4.7,8.3l0,0L4,9l0,0l0.7,0.7l0,0l8.5,8.3l0.7-0.7L5.4,9L14,0.7z" />
                </symbol>
            </svg>
        </div>
    );
};

export default Slideshow;
