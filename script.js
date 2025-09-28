// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAfMYFvW7NbsFGPFAOiE6O2lljdaLGfhfA",
    authDomain: "prometheai-1me5o.firebaseapp.com",
    projectId: "prometheai-1me5o",
    storageBucket: "prometheai-1me5o.firebasestorage.app",
    messagingSenderId: "427862967088",
    appId: "1:427862967088:web:777de6c6b2ac5393763ef5",
    measurementId: "G-3J491JX7NP"
};

// Initialize Firebase when page loads
let firebaseBeatStore;

// Initialize Firebase after DOM loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Initialize our beat store manager
    firebaseBeatStore = new FirebaseBeatStore();

    console.log('🔥 Firebase initialized for Blais Beats Store');

    // Load beats from Firebase
    loadBeatsFromFirebase();
});

// Beat Data Structure - Updated for new design
const beatCatalog = [
    { id: 1, title: "Autumn Vibes", artist: "BLAIS", bpm: 140, duration: "3:48", genre: "Hip Hop", tags: ["dark", "melodic", "trap"], price: 39.99 },
    { id: 2, title: "Neon Dreams", artist: "BLAIS", bpm: 128, duration: "4:12", genre: "Hip Hop", tags: ["synth", "retro", "ambient"], price: 39.99 },
    { id: 3, title: "Chrome Hearts", artist: "BLAIS", bpm: 145, duration: "3:33", genre: "Trap", tags: ["heavy", "bass", "aggressive"], price: 39.99 },
    { id: 4, title: "Stellar Journey", artist: "BLAIS", bpm: 110, duration: "4:45", genre: "R&B", tags: ["space", "ethereal", "calm"], price: 39.99 },
    { id: 5, title: "Circuit Breaker", artist: "BLAIS", bpm: 130, duration: "3:21", genre: "Boom Bap", tags: ["industrial", "glitch", "cyber"], price: 39.99 },
    { id: 6, title: "Midnight Rush", artist: "BLAIS", bpm: 150, duration: "3:55", genre: "Hip Hop", tags: ["fast", "energetic", "dark"], price: 39.99 },
    { id: 7, title: "Ocean Drive", artist: "BLAIS", bpm: 120, duration: "3:28", genre: "R&B", tags: ["smooth", "waves", "summer"], price: 39.99 },
    { id: 8, title: "Digital Dreams", artist: "BLAIS", bpm: 135, duration: "3:42", genre: "Trap", tags: ["digital", "futuristic", "electronic"], price: 39.99 },
    { id: 9, title: "Golden Hour", artist: "BLAIS", bpm: 90, duration: "4:15", genre: "Hip Hop", tags: ["warm", "peaceful", "sunset"], price: 39.99 },
    { id: 10, title: "Bass Thunder", artist: "BLAIS", bpm: 155, duration: "3:18", genre: "Trap", tags: ["heavy", "thunder", "aggressive"], price: 39.99 }
];

// Licensing Options
const licenseOptions = [
    {
        type: "Streaming Lease License",
        description: "WAV, MP3",
        price: 39.99,
        features: [
            "Used for Music Recording",
            "Distribute up to LIMITED copies",
            "Limited Online Audio Streams",
            "Basic Music Video rights",
            "Non-Exclusive Rights"
        ]
    },
    {
        type: "Unlimited Wav Master License",
        description: "Buy 1 Get 1 Free",
        price: 79.99,
        features: [
            "WAV, MP3 formats",
            "Used for Music Recording",
            "Distribute up to UNLIMITED copies",
            "UNLIMITED Online Audio Streams",
            "Enhanced Music Video rights"
        ]
    },
    {
        type: "Unlimited Plus",
        description: "Buy 1 Get 4 Free",
        price: 99.99,
        features: [
            "WAV, STEMS, MP3 formats",
            "Used for Music Recording",
            "Distribute up to UNLIMITED copies",
            "UNLIMITED Online Audio Streams",
            "UNLIMITED Music Video rights"
        ]
    },
    {
        type: "Unlimited + 100% Publishing + Lifetime",
        description: "",
        makeOffer: true,
        minPrice: 250,
        features: [
            "WAV, STEMS, MP3 formats",
            "Used for Music Recording",
            "Distribute up to UNLIMITED copies",
            "UNLIMITED Online Audio Streams",
            "UNLIMITED Music Video",
            "For Profit Live Performances",
            "Radio Broadcasting rights (UNLIMITED Stations)"
        ],
        featured: true
    }
];

// Global state
let currentBeat = null;
let isPlaying = false;
let cart = [];
let selectedFilter = 'All';
let searchTerm = '';
let isRepeatEnabled = false;

// Audio visualization
let animationFrame = null;
let animationTime = 0;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Create starfield background
    createStarfield();

    // Initialize mobile navigation
    initializeMobileNav();

    // Initialize search functionality
    initializeSearch();

    // Initialize filter tabs
    initializeFilters();

    // Initialize Windows 95 player
    initializeWin95Player();

    // Initialize tracklist
    initializeTracklist();

    // Initialize navigation scroll
    initializeNavigation();

    // Update cart count display
    updateCartDisplay();

    console.log('Beat store initialized successfully');
}

// Starfield Background
function createStarfield() {
    const starfield = document.getElementById('starfield');
    if (!starfield) return;

    starfield.innerHTML = '';
    const starCount = 150;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        // Random size
        const size = Math.random();
        if (size < 0.6) {
            star.classList.add('small');
        } else if (size < 0.9) {
            star.classList.add('medium');
        } else {
            star.classList.add('large');
        }

        // Random position
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';

        // Random animation delay
        star.style.animationDelay = Math.random() * 2 + 's';

        starfield.appendChild(star);
    }
}

// Mobile Navigation
function initializeMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        // Show toggle button on mobile
        function checkMobile() {
            if (window.innerWidth <= 768) {
                navToggle.style.display = 'block';
            } else {
                navToggle.style.display = 'none';
                navLinks.classList.remove('open');
            }
        }

        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Toggle menu
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('open');
        });

        // Close menu when clicking links
        navLinks.addEventListener('click', function(e) {
            if (e.target.classList.contains('nav-link')) {
                navLinks.classList.remove('open');
            }
        });
    }
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchTerm = e.target.value.toLowerCase();
            updateTracklist();
        });
    }
}

// Filter Functionality
function initializeFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');

            // Update selected filter
            selectedFilter = this.dataset.genre;

            // Update tracklist
            updateTracklist();
        });
    });
}

// Navigation Scroll
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }

            // Update active nav link
            navLinks.forEach(nl => nl.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Windows 95 Player
function initializeWin95Player() {
    const playButton = document.getElementById('win95-play');
    const prevButton = document.getElementById('win95-prev');
    const nextButton = document.getElementById('win95-next');
    const repeatButton = document.getElementById('win95-repeat');
    const volumeInput = document.querySelector('.win95-volume-input');

    if (playButton) {
        playButton.addEventListener('click', togglePlayPause);
    }

    if (prevButton) {
        prevButton.addEventListener('click', playPrevious);
    }

    if (nextButton) {
        nextButton.addEventListener('click', playNext);
    }

    if (repeatButton) {
        repeatButton.addEventListener('click', toggleRepeat);
    }

    if (volumeInput) {
        volumeInput.addEventListener('input', function(e) {
            const volume = e.target.value;
            updateVolumeDisplay(volume);
        });
    }

    // Initialize visualization
    initializeVisualization();
}

// Audio Visualization
function initializeVisualization() {
    const canvas = document.getElementById('win95-visualizer');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function animate() {
        animationTime += 0.1;

        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (isPlaying && currentBeat) {
            drawSpectrumBars(ctx, canvas.width, canvas.height);

            // Draw track info overlay
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(10, 10, canvas.width - 20, 35);

            ctx.fillStyle = '#00FFFF';
            ctx.font = '14px monospace';
            ctx.fillText(`♪ ${currentBeat.title} - $${currentBeat.price}`, 20, 32);
        } else {
            // Static display
            ctx.fillStyle = '#333333';
            ctx.font = '16px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('BLAIS Beat Player', canvas.width / 2, canvas.height / 2);
            ctx.fillStyle = '#555555';
            ctx.font = '12px monospace';
            ctx.fillText('Select a beat to start playing', canvas.width / 2, canvas.height / 2 + 25);
            ctx.textAlign = 'left';
        }

        if (isPlaying) {
            animationFrame = requestAnimationFrame(animate);
        } else {
            // Continue animation even when paused for demo
            animationFrame = requestAnimationFrame(animate);
        }
    }

    animate();
}

function drawSpectrumBars(ctx, width, height) {
    if (!currentBeat) return;

    const barCount = 64;
    const barWidth = Math.max(2, Math.floor(width / barCount) - 1);
    const bpmFactor = currentBeat.bpm / 120; // Normalize around 120 BPM

    for (let i = 0; i < barCount; i++) {
        let intensity = 0;

        // Generate frequency data based on beat characteristics
        if (currentBeat.tags.includes('bass') || currentBeat.tags.includes('heavy')) {
            // Boost low frequencies for bass-heavy tracks
            intensity = i < 16 ?
                Math.sin(animationTime * bpmFactor + i * 0.2) * 180 + 80 :
                Math.sin(animationTime * bpmFactor * 0.5 + i * 0.1) * 60 + 30;
        } else if (currentBeat.tags.includes('synth') || currentBeat.tags.includes('electronic')) {
            // Boost mid-high frequencies for synth tracks
            intensity = i > 32 ?
                Math.sin(animationTime * bpmFactor * 1.5 + i * 0.15) * 120 + 60 :
                Math.sin(animationTime * bpmFactor + i * 0.1) * 80 + 40;
        } else if (currentBeat.tags.includes('ambient') || currentBeat.tags.includes('calm')) {
            // Smoother, lower intensity for ambient tracks
            intensity = Math.sin(animationTime * bpmFactor * 0.7 + i * 0.05) * 60 + 30;
        } else {
            // Default pattern
            intensity = Math.sin(animationTime * bpmFactor + i * 0.1) * 100 + 50;
        }

        intensity = Math.max(0, Math.min(255, intensity));
        const normalizedIntensity = intensity / 255;
        const barHeight = normalizedIntensity * (height * 0.8) + 10;

        const x = i * (barWidth + 1);
        const y = height - barHeight;

        // Color based on frequency range
        let hue;
        if (i < barCount * 0.33) {
            hue = 240 + (i / (barCount * 0.33)) * 60; // Blue to cyan for bass
        } else if (i < barCount * 0.66) {
            hue = 300 + (i / (barCount * 0.66)) * 60; // Cyan to green for mids
        } else {
            hue = 0 + (i / barCount) * 60; // Green to red for highs
        }

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, `hsl(${hue}, 100%, 70%)`);
        gradient.addColorStop(1, `hsl(${hue + 30}, 100%, 40%)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Add glow effect based on intensity
        if (normalizedIntensity > 0.6) {
            ctx.shadowColor = `hsl(${hue}, 100%, 70%)`;
            ctx.shadowBlur = 15;
            ctx.fillRect(x, y, barWidth, barHeight);
            ctx.shadowBlur = 0;
        }
    }
}

// Tracklist Management
function initializeTracklist() {
    updateTracklist();
}

function updateTracklist() {
    const tracklistBody = document.getElementById('tracklist-body');
    if (!tracklistBody) return;

    const filteredBeats = getFilteredBeats();

    tracklistBody.innerHTML = filteredBeats.map((beat, index) => `
        <div class="track-item ${currentBeat && currentBeat.id === beat.id && isPlaying ? 'playing' : ''}"
             data-beat-id="${beat.id}" onclick="playBeat(${beat.id})">
            <div class="track-num">${String(index + 1).padStart(2, '0')}</div>
            <div class="track-title">${beat.title}</div>
            <div class="track-bpm">${beat.bpm}</div>
            <div class="track-time">${beat.duration}</div>
            <div class="track-price">$${beat.price}</div>
            <div class="track-action">
                <button class="add-btn ${isInCart(beat.id) ? 'added' : ''}"
                        onclick="event.stopPropagation(); addToCart(${beat.id})">
                    ${isInCart(beat.id) ? 'ADDED' : 'ADD'}
                </button>
            </div>
        </div>
    `).join('');
}

function getFilteredBeats() {
    return beatCatalog.filter(beat => {
        const matchesFilter = selectedFilter === 'All' || beat.genre === selectedFilter;
        const matchesSearch = searchTerm === '' ||
            beat.title.toLowerCase().includes(searchTerm) ||
            beat.tags.some(tag => tag.toLowerCase().includes(searchTerm));

        return matchesFilter && matchesSearch;
    });
}

// Audio Player Controls
function playBeat(beatId) {
    const beat = beatCatalog.find(b => b.id === beatId);
    if (!beat) return;

    currentBeat = beat;
    isPlaying = true;

    // Update play button
    const playButton = document.getElementById('win95-play');
    if (playButton) {
        playButton.textContent = '⏸';
    }

    // Update track info
    updateTrackInfo(beat);

    // Update tracklist highlighting
    updateTracklist();

    console.log(`Playing: ${beat.title}`);
}

function togglePlayPause() {
    const playButton = document.getElementById('win95-play');

    if (isPlaying) {
        isPlaying = false;
        if (playButton) playButton.textContent = '▶';
    } else {
        if (!currentBeat && beatCatalog.length > 0) {
            const filteredBeats = getFilteredBeats();
            if (filteredBeats.length > 0) {
                currentBeat = filteredBeats[0];
            }
        }

        if (currentBeat) {
            isPlaying = true;
            if (playButton) playButton.textContent = '⏸';
            updateTrackInfo(currentBeat);
        }
    }

    updateTracklist();
}

function playPrevious() {
    if (!currentBeat) return;

    const filteredBeats = getFilteredBeats();
    const currentIndex = filteredBeats.findIndex(beat => beat.id === currentBeat.id);

    if (currentIndex > 0) {
        playBeat(filteredBeats[currentIndex - 1].id);
    } else {
        playBeat(filteredBeats[filteredBeats.length - 1].id);
    }
}

function playNext() {
    if (!currentBeat) return;

    const filteredBeats = getFilteredBeats();
    const currentIndex = filteredBeats.findIndex(beat => beat.id === currentBeat.id);

    if (currentIndex < filteredBeats.length - 1) {
        playBeat(filteredBeats[currentIndex + 1].id);
    } else {
        playBeat(filteredBeats[0].id);
    }
}

function toggleRepeat() {
    isRepeatEnabled = !isRepeatEnabled;
    const repeatButton = document.getElementById('win95-repeat');
    if (repeatButton) {
        if (isRepeatEnabled) {
            repeatButton.classList.add('active');
            repeatButton.style.background = '#0080FF';
            repeatButton.style.color = '#ffffff';
        } else {
            repeatButton.classList.remove('active');
            repeatButton.style.background = '#C0C0C0';
            repeatButton.style.color = '#000000';
        }
    }
    console.log(`Repeat ${isRepeatEnabled ? 'enabled' : 'disabled'}`);
}

function updateTrackInfo(beat) {
    const trackTitle = document.getElementById('win95-track-title');
    const trackBpm = document.getElementById('win95-track-bpm');
    const trackPrice = document.getElementById('win95-track-price');
    const currentTime = document.getElementById('win95-current-time');
    const totalTime = document.getElementById('win95-total-time');

    if (trackTitle) trackTitle.textContent = beat.title;
    if (trackBpm) trackBpm.textContent = beat.bpm;
    if (trackPrice) trackPrice.textContent = beat.price;
    if (totalTime) totalTime.textContent = beat.duration;

    // Simulate progress (for demo)
    if (currentTime) {
        currentTime.textContent = '0:00';
        simulateProgress(beat.duration);
    }
}

function simulateProgress(duration) {
    const [minutes, seconds] = duration.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;
    let currentSeconds = 0;

    const interval = setInterval(() => {
        if (!isPlaying || !currentBeat) {
            clearInterval(interval);
            return;
        }

        currentSeconds++;
        const mins = Math.floor(currentSeconds / 60);
        const secs = currentSeconds % 60;

        const currentTimeEl = document.getElementById('win95-current-time');
        const progressEl = document.getElementById('win95-progress');

        if (currentTimeEl) {
            currentTimeEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        if (progressEl) {
            const percentage = (currentSeconds / totalSeconds) * 100;
            progressEl.style.width = `${Math.min(percentage, 100)}%`;
        }

        if (currentSeconds >= totalSeconds) {
            clearInterval(interval);
            if (isRepeatEnabled) {
                // Restart the same track
                playBeat(currentBeat.id);
            } else {
                // Auto-play next track
                playNext();
            }
        }
    }, 1000);
}

function updateVolumeDisplay(volume) {
    const volumeFill = document.querySelector('.win95-volume-fill');
    const volumeValue = document.querySelector('.win95-volume-value');

    if (volumeFill) {
        volumeFill.style.width = `${volume}%`;
    }

    if (volumeValue) {
        volumeValue.textContent = `${volume}%`;
    }
}

// Cart Management
function addToCart(beatId) {
    const beat = beatCatalog.find(b => b.id === beatId);
    if (!beat) return;

    if (isInCart(beatId)) {
        showLicensePopup(beat);
        return;
    }

    // Show license popup instead of directly adding to cart
    showLicensePopup(beat);
}

function showLicensePopup(beat) {
    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.className = 'license-popup-overlay';
    overlay.innerHTML = `
        <div class="license-popup">
            <div class="license-popup-header">
                <h3>Choose License for "${beat.title}"</h3>
                <button class="license-popup-close">&times;</button>
            </div>
            <div class="license-popup-content">
                <div class="license-options-grid">
                    ${licenseOptions.map((license, index) => `
                        <div class="license-option ${license.featured ? 'featured' : ''}" data-license-index="${index}">
                            ${license.featured ? `
                                <div class="license-corners">
                                    <div class="corner corner-tl"></div>
                                    <div class="corner corner-tr"></div>
                                    <div class="corner corner-bl"></div>
                                    <div class="corner corner-br"></div>
                                </div>
                            ` : ''}
                            <div class="license-header">
                                <h4 class="license-type">${license.type}</h4>
                                <p class="license-description">${license.description}</p>
                                ${license.makeOffer ?
                                    '<div class="license-price">Make an Offer</div>' :
                                    `<div class="license-price">$${license.price}</div>`
                                }
                            </div>
                            <div class="license-features">
                                ${license.features.map(feature => `
                                    <div class="license-feature">✓ ${feature}</div>
                                `).join('')}
                            </div>
                            ${license.makeOffer ? `
                                <div class="make-offer-section">
                                    <input type="number" class="offer-input" placeholder="Enter your offer" min="${license.minPrice}" id="offer-input-${index}">
                                    <div class="offer-error" id="offer-error-${index}" style="display: none; color: #ff4444; font-size: 12px; margin-top: 5px;"></div>
                                    <button class="license-select-btn" onclick="makeOffer(${beat.id}, ${index})">
                                        MAKE OFFER
                                    </button>
                                </div>
                            ` : `
                                <button class="license-select-btn" onclick="addToCartWithLicense(${beat.id}, ${index})">
                                    SELECT LICENSE
                                </button>
                            `}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Close popup functionality
    const closeBtn = overlay.querySelector('.license-popup-close');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
}

function makeOffer(beatId, licenseIndex) {
    const beat = beatCatalog.find(b => b.id === beatId);
    const license = licenseOptions[licenseIndex];
    const offerInput = document.getElementById(`offer-input-${licenseIndex}`);
    const offerError = document.getElementById(`offer-error-${licenseIndex}`);

    if (!beat || !license || !offerInput) return;

    const offerAmount = parseFloat(offerInput.value);

    // Validate offer
    if (isNaN(offerAmount) || offerAmount <= 0) {
        offerError.textContent = "Please enter a valid offer amount";
        offerError.style.display = "block";
        return;
    }

    if (offerAmount < license.minPrice) {
        offerError.textContent = "Your Offer is Too Low";
        offerError.style.display = "block";
        return;
    }

    // Offer accepted - add to cart
    offerError.style.display = "none";
    addToCartWithLicense(beatId, licenseIndex, offerAmount);
}

function addToCartWithLicense(beatId, licenseIndex, customPrice = null) {
    const beat = beatCatalog.find(b => b.id === beatId);
    const license = licenseOptions[licenseIndex];

    if (!beat || !license) return;

    // Create cart item with license
    const cartItem = {
        ...beat,
        license: license,
        cartPrice: customPrice || license.price,
        id: `${beat.id}-${licenseIndex}` // Unique ID for cart
    };

    cart.push(cartItem);
    updateCartDisplay();
    updateTracklist();

    // Close popup
    const overlay = document.querySelector('.license-popup-overlay');
    if (overlay) {
        document.body.removeChild(overlay);
    }

    const priceDisplay = customPrice ? `$${customPrice}` : `$${license.price}`;
    console.log(`Added to cart: ${beat.title} with ${license.type} license (${priceDisplay})`);
}

function isInCart(beatId) {
    return cart.some(beat => beat.id === beatId);
}

function updateCartDisplay() {
    const cartCounts = document.querySelectorAll('.cart-count, #cart-count');
    cartCounts.forEach(element => {
        if (element) element.textContent = cart.length;
    });
    updateCartDropdown();
}

// Cart Dropdown Functions
function toggleCartDropdown() {
    const dropdown = document.getElementById('cart-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
        // Close dropdown when clicking outside
        if (dropdown.classList.contains('show')) {
            setTimeout(() => {
                document.addEventListener('click', closeCartDropdown);
            }, 100);
        }
    }
}

function closeCartDropdown(e) {
    const dropdown = document.getElementById('cart-dropdown');
    const cartContainer = document.querySelector('.cart-container');

    if (dropdown && !cartContainer.contains(e.target)) {
        dropdown.classList.remove('show');
        document.removeEventListener('click', closeCartDropdown);
    }
}

function updateCartDropdown() {
    const cartItems = document.getElementById('cart-dropdown-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.querySelector('.checkout-btn');

    if (!cartItems || !cartTotal || !checkoutBtn) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
        cartTotal.textContent = 'Total: $0.00';
        checkoutBtn.disabled = true;
    } else {
        const total = cart.reduce((sum, item) => sum + item.cartPrice, 0);

        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-license">${item.license.type}</div>
                </div>
                <div class="cart-item-price">$${item.cartPrice}</div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})" title="Remove item">×</button>
            </div>
        `).join('');

        cartTotal.textContent = `Total: $${total.toFixed(2)}`;
        checkoutBtn.disabled = false;
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
    updateTracklist();
}

function proceedToCheckout() {
    if (cart.length === 0) return;

    // Calculate total
    const total = cart.reduce((sum, item) => sum + item.cartPrice, 0);

    // Create checkout summary
    const checkoutItems = cart.map(item =>
        `${item.title} - ${item.license.type} ($${item.cartPrice})`
    ).join('\n');

    const checkoutMessage = `Checkout Summary:\n\n${checkoutItems}\n\nTotal: $${total.toFixed(2)}\n\nRedirecting to payment...`;

    alert(checkoutMessage);

    // Here you would typically redirect to a payment processor
    // For now, we'll just clear the cart
    setTimeout(() => {
        cart = [];
        updateCartDisplay();
        updateTracklist();
        toggleCartDropdown(); // Close dropdown
        alert('Thank you for your purchase! Download links will be sent to your email.');
    }, 2000);
}

// Utility Functions
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Initialize smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Firebase helper functions
async function loadBeatsFromFirebase() {
    try {
        console.log('📥 Loading beats from Firebase...');
        const beats = await firebaseBeatStore.loadBeats();

        if (beats.length > 0) {
            // Replace mock data with Firebase data
            beatCatalog.length = 0;
            beatCatalog.push(...beats);
            updateTracklist();
            console.log(`✅ Loaded ${beats.length} beats from Firebase`);
        } else {
            console.log('⚠️ No beats found in Firebase, using mock data');
        }
    } catch (error) {
        console.error('❌ Error loading beats from Firebase:', error);
        console.log('🔄 Using mock data as fallback');
    }
}

// Admin function to upload beat to Firebase
async function uploadBeatToFirebase(beatData, files) {
    try {
        console.log('🔄 Uploading beat to Firebase...');

        // Upload files to Firebase Storage
        const fileUrls = await firebaseBeatStore.uploadBeatFiles(beatData, files);

        // Add beat to Firestore database
        const result = await firebaseBeatStore.addBeat(beatData, fileUrls);

        if (result.success) {
            console.log('✅ Beat uploaded successfully!');
            await loadBeatsFromFirebase(); // Refresh catalog
            return result;
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('❌ Error uploading beat:', error);
        return { success: false, error: error.message };
    }
}

// Console log for debugging
console.log('Beat Store Script Loaded - New Design Version');