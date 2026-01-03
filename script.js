document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

    ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        effects: true,
        smooth: 3,
        speed: 1
    });

    // Generate random stars
    const background = document.querySelector('.background');
    if (background) {
        background.innerHTML = ''; // Clear placeholder
        for (let i = 0; i < 500; i++) {
            const star = document.createElement('img');
            star.src = 'star.svg';
            star.classList.add('star');
            star.style.position = 'absolute';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            const size = Math.random() * 20 + 10 + 'px';
            star.style.width = size;
            star.style.height = size;
            star.style.transform = `rotate(${Math.random() * 360}deg)`;
            star.style.opacity = Math.random() * 0.7 + 0.3;
            background.appendChild(star);
        }
    }

    const btn = document.getElementById('btn');

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    btn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        let theme = 'light';
        if (document.body.classList.contains('dark-mode')) {
            theme = 'dark';
        }
        localStorage.setItem('theme', theme);
    });



    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#uvod",
            start: "top top", // Pin below the nav bar
            end: "bottom center",
            scrub: 0,
            pin: ".pin-wrapper",
            markers: false
        }
    });

    tl.to(".hello-text, #tulen", {
        y: -window.innerHeight * 0.5,
        scale: 0.5,
    });

    const tweens = {};

    const borderRects = document.querySelectorAll(".section-border-rect");
    borderRects.forEach(rect => {
        const totalLength = rect.getTotalLength() || 1000;
        const segmentLength = totalLength / 4;

        rect.style.strokeDasharray = `${segmentLength} ${totalLength}`;
        rect.style.strokeDashoffset = segmentLength;

        const section = rect.closest("section");

        // Store the tween
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 70%",
                end: "top 30%",
                toggleActions: "restart none restart reset"
            }
        });

        tl.set(rect, { opacity: 1 })
            .to(rect, {
                strokeDashoffset: -totalLength,
                duration: 2,
                ease: "power1.inOut"
            })
            .to(rect, { opacity: 0, duration: 0.2 });

        tweens[section.id] = tl;
    });

    // Replay animation on click
    const menuLinks = document.querySelectorAll("nav ul li a");
    menuLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("href").substring(1);
            if (tweens[targetId]) {
                tweens[targetId].restart();
            }
        });
    });

});
