const LANGUAGES = [
    { code: 'af', name: 'Afrikaans', native: 'Afrikaans' },
    { code: 'sq', name: 'Albanian', native: 'Shqip' },
    { code: 'am', name: 'Amharic', native: 'አማርኛ' },
    { code: 'ar', name: 'Arabic', native: 'العربية' },
    { code: 'hy', name: 'Armenian', native: 'Հայերեն' },
    { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
    { code: 'ay', name: 'Aymara', native: 'Aymar aru' },
    { code: 'az', name: 'Azerbaijani', native: 'Azərbaycanca' },
    { code: 'bm', name: 'Bambara', native: 'Bamanankan' },
    { code: 'eu', name: 'Basque', native: 'Euskara' },
    { code: 'be', name: 'Belarusian', native: 'Беларуская' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'bho', name: 'Bhojpuri', native: 'भोजपुरी' },
    { code: 'bs', name: 'Bosnian', native: 'Bosanski' },
    { code: 'bg', name: 'Bulgarian', native: 'Български' },
    { code: 'ca', name: 'Catalan', native: 'Català' },
    { code: 'ceb', name: 'Cebuano', native: 'Cebuano' },
    { code: 'zh-CN', name: 'Chinese (Simplified)', native: '简体中文' },
    { code: 'zh-TW', name: 'Chinese (Traditional)', native: '繁體中文' },
    { code: 'co', name: 'Corsican', native: 'Corse' },
    { code: 'hr', name: 'Croatian', native: 'Hrvatski' },
    { code: 'cs', name: 'Czech', native: 'Čeština' },
    { code: 'da', name: 'Danish', native: 'Dansk' },
    { code: 'dv', name: 'Dhivehi', native: 'ދިވެހިބަސް' },
    { code: 'doi', name: 'Dogri', native: 'डोगरी' },
    { code: 'nl', name: 'Dutch', native: 'Nederlands' },
    { code: 'en', name: 'English', native: 'English' },
    { code: 'eo', name: 'Esperanto', native: 'Esperanto' },
    { code: 'et', name: 'Estonian', native: 'Eesti' },
    { code: 'ee', name: 'Ewe', native: 'Eʋegbe' },
    { code: 'fil', name: 'Filipino (Tagalog)', native: 'Wikang Filipino' },
    { code: 'fi', name: 'Finnish', native: 'Suomi' },
    { code: 'fr', name: 'French', native: 'Français' },
    { code: 'fy', name: 'Frisian', native: 'Frysk' },
    { code: 'gl', name: 'Galician', native: 'Galego' },
    { code: 'ka', name: 'Georgian', native: 'ქართული' },
    { code: 'de', name: 'German', native: 'Deutsch' },
    { code: 'el', name: 'Greek', native: 'Ελληνικά' },
    { code: 'gn', name: 'Guarani', native: 'Avañe\'ẽ' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'ht', name: 'Haitian Creole', native: 'Kreyòl Ayisyen' },
    { code: 'ha', name: 'Hausa', native: 'Hausa' },
    { code: 'haw', name: 'Hawaiian', native: '\'Ōlelo Hawai\'i' },
    { code: 'he', name: 'Hebrew', native: 'עברית' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'hmn', name: 'Hmong', native: 'Hmoob' },
    { code: 'hu', name: 'Hungarian', native: 'Magyar' },
    { code: 'is', name: 'Icelandic', native: 'Íslenska' },
    { code: 'ig', name: 'Igbo', native: 'Asụsụ Igbo' },
    { code: 'ilo', name: 'Ilocano', native: 'Ilokano' },
    { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' },
    { code: 'ga', name: 'Irish', native: 'Gaeilge' },
    { code: 'it', name: 'Italian', native: 'Italiano' },
    { code: 'ja', name: 'Japanese', native: '日本語' },
    { code: 'jv', name: 'Javanese', native: 'Basa Jawa' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'kk', name: 'Kazakh', native: 'Қазақ тілі' },
    { code: 'km', name: 'Khmer', native: 'ខ្មែរ' },
    { code: 'rw', name: 'Kinyarwanda', native: 'Ikinyarwanda' },
    { code: 'gom', name: 'Konkani', native: 'कोंकणी' },
    { code: 'ko', name: 'Korean', native: '한국어' },
    { code: 'kri', name: 'Krio', native: 'Krio' },
    { code: 'ku', name: 'Kurdish', native: 'Kurdî' },
    { code: 'ckb', name: 'Kurdish (Sorani)', native: 'کوردیی ناوەندی' },
    { code: 'ky', name: 'Kyrgyz', native: 'Кыргызча' },
    { code: 'lo', name: 'Lao', native: 'ລາວ' },
    { code: 'la', name: 'Latin', native: 'Latina' },
    { code: 'lv', name: 'Latvian', native: 'Latviešu' },
    { code: 'ln', name: 'Lingala', native: 'Lingála' },
    { code: 'lt', name: 'Lithuanian', native: 'Lietuvių' },
    { code: 'lg', name: 'Luganda', native: 'Luganda' },
    { code: 'lb', name: 'Luxembourgish', native: 'Lëtzebuergesch' },
    { code: 'mk', name: 'Macedonian', native: 'Македонски' },
    { code: 'mai', name: 'Maithili', native: 'मैथिली' },
    { code: 'mg', name: 'Malagasy', native: 'Malagasy' },
    { code: 'ms', name: 'Malay', native: 'Bahasa Melayu' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'mt', name: 'Maltese', native: 'Malti' },
    { code: 'mi', name: 'Maori', native: 'Māori' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'mni-Mtei', name: 'Meiteilon (Manipuri)', native: 'ꯃꯤꯇꯩꯂꯣꯟ' },
    { code: 'lus', name: 'Mizo', native: 'Mizo ṭawng' },
    { code: 'mn', name: 'Mongolian', native: 'Монгол' },
    { code: 'my', name: 'Myanmar (Burmese)', native: 'မြန်မာ' },
    { code: 'ne', name: 'Nepali', native: 'नेपाली' },
    { code: 'no', name: 'Norwegian', native: 'Norsk' },
    { code: 'ny', name: 'Nyanja (Chichewa)', native: 'Chichewa' },
    { code: 'or', name: 'Odia (Oriya)', native: 'ଓଡ଼ିଆ' },
    { code: 'om', name: 'Oromo', native: 'Oromoo' },
    { code: 'ps', name: 'Pashto', native: 'پښتو' },
    { code: 'fa', name: 'Persian', native: 'فارسی' },
    { code: 'pl', name: 'Polish', native: 'Polski' },
    { code: 'pt', name: 'Portuguese (Portugal, Brazil)', native: 'Português' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'qu', name: 'Quechua', native: 'Runasimi' },
    { code: 'ro', name: 'Romanian', native: 'Română' },
    { code: 'ru', name: 'Russian', native: 'Русский' },
    { code: 'sm', name: 'Samoan', native: 'Gagana Sāmoa' },
    { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्' },
    { code: 'gd', name: 'Scots Gaelic', native: 'Gàidhlig' },
    { code: 'nso', name: 'Sepedi', native: 'Sepedi' },
    { code: 'sr', name: 'Serbian', native: 'Српски' },
    { code: 'st', name: 'Sesotho', native: 'Sesotho' },
    { code: 'sn', name: 'Shona', native: 'ChiShona' },
    { code: 'sd', name: 'Sindhi', native: 'سنڌي' },
    { code: 'si', name: 'Sinhala', native: 'සිංහල' },
    { code: 'sk', name: 'Slovak', native: 'Slovenčina' },
    { code: 'sl', name: 'Slovenian', native: 'Slovenščina' },
    { code: 'so', name: 'Somali', native: 'Soomaali' },
    { code: 'es', name: 'Spanish', native: 'Español' },
    { code: 'su', name: 'Sundanese', native: 'Basa Sunda' },
    { code: 'sw', name: 'Swahili', native: 'Kiswahili' },
    { code: 'sv', name: 'Swedish', native: 'Svenska' },
    { code: 'tg', name: 'Tajik', native: 'Тоҷикӣ' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'tt', name: 'Tatar', native: 'Татар' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'th', name: 'Thai', native: 'ไทย' },
    { code: 'ti', name: 'Tigrinya', native: 'ትግርኛ' },
    { code: 'ts', name: 'Tsonga', native: 'Xitsonga' },
    { code: 'tr', name: 'Turkish', native: 'Türkçe' },
    { code: 'tk', name: 'Turkmen', native: 'Türkmenler' },
    { code: 'ak', name: 'Twi (Akan)', native: 'Akan' },
    { code: 'uk', name: 'Ukrainian', native: 'Українська' },
    { code: 'ur', name: 'Urdu', native: 'اردو' },
    { code: 'ug', name: 'Uyghur', native: 'ئۇيغۇرច' },
    { code: 'uz', name: 'Uzbek', native: 'Oʻzbek' },
    { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' },
    { code: 'cy', name: 'Welsh', native: 'Cymraeg' },
    { code: 'xh', name: 'Xhosa', native: 'isiXhosa' },
    { code: 'yi', name: 'Yiddish', native: 'ייִדיש' },
    { code: 'yo', name: 'Yoruba', native: 'Ede Yoruba' },
    { code: 'zu', name: 'Zulu', native: 'isiZulu' }
];

document.addEventListener('DOMContentLoaded', () => {
    // Create the overlay elements
    const overlay = document.createElement('div');
    overlay.id = 'lang-selector-overlay';
    overlay.innerHTML = `
        <div class="lang-selector-container">
            <div class="lang-selector-header">
                <h2>Select Language</h2>
                <div class="lang-search-wrapper">
                    <input type="text" id="lang-search" placeholder="Search language...">
                    <i class="fas fa-search"></i>
                </div>
                <button id="lang-selector-close">&times;</button>
            </div>
            <div class="lang-grid" id="lang-grid"></div>
        </div>
    `;
    document.body.appendChild(overlay);

    const langGrid = document.getElementById('lang-grid');
    const searchInput = document.getElementById('lang-search');
    const closeBtn = document.getElementById('lang-selector-close');

    // Function to render languages
    const renderLanguages = (filter = '') => {
        langGrid.innerHTML = '';
        const filtered = LANGUAGES.filter(l =>
            l.name.toLowerCase().includes(filter.toLowerCase()) ||
            l.native.toLowerCase().includes(filter.toLowerCase())
        );

        filtered.forEach(lang => {
            const btn = document.createElement('div');
            btn.className = 'lang-item';
            btn.innerHTML = `
                <span class="lang-native">${lang.native}</span>
                <span class="lang-name">${lang.name}</span>
            `;
            btn.onclick = () => selectLanguage(lang.code);
            langGrid.appendChild(btn);
        });
    };

    const selectLanguage = (code) => {
        // Save selected language to localStorage
        localStorage.setItem('selectedLanguage', code);

        const triggerTranslation = () => {
            const googleSelect = document.querySelector('.goog-te-combo');
            if (googleSelect) {
                googleSelect.value = code;
                googleSelect.dispatchEvent(new Event('change'));
                overlay.classList.remove('active');
                return true;
            }
            // Check if it's inside an iframe (rare for simple widget but possible)
            const iframes = document.querySelectorAll('iframe.goog-te-menu-frame');
            if (iframes.length > 0) {
                // If it's a menu-based one, logic is different, but we try to find the select
                const combo = document.querySelector('.goog-te-combo');
                if (combo) {
                    combo.value = code;
                    combo.dispatchEvent(new Event('change'));
                    overlay.classList.remove('active');
                    return true;
                }
            }
            return false;
        };

        if (!triggerTranslation()) {
            console.log("Waiting for Google Translate widget to initialize...");
            let attempts = 0;
            const interval = setInterval(() => {
                attempts++;
                if (triggerTranslation() || attempts > 30) {
                    clearInterval(interval);
                    if (attempts > 30) {
                        console.error('Google Translate widget failed to load after 30 attempts');
                        // Try to re-init if possible
                        if (typeof googleTranslateElementInit === 'function') {
                            googleTranslateElementInit();
                        }
                        alert('Translator is taking longer than expected. Please wait a few seconds and try again.');
                    }
                }
            }, 500);
        }
    };

    // Auto-restore previously selected language on page load
    const restoreLanguage = () => {
        const savedLang = localStorage.getItem('selectedLanguage');
        if (savedLang && savedLang !== 'en') {
            console.log('Restoring language:', savedLang);

            const attemptRestore = () => {
                const googleSelect = document.querySelector('.goog-te-combo');
                if (googleSelect) {
                    console.log('Google Translate widget found, restoring to:', savedLang);
                    googleSelect.value = savedLang;
                    googleSelect.dispatchEvent(new Event('change'));
                    return true;
                }
                return false;
            };

            // Try immediately
            if (attemptRestore()) return;

            // If not ready, keep trying
            let attempts = 0;
            const checkAndRestore = setInterval(() => {
                attempts++;
                if (attemptRestore() || attempts > 60) {
                    clearInterval(checkAndRestore);
                    if (attempts > 60) {
                        console.warn('Could not restore language after 60 attempts');
                    }
                }
            }, 250); // Check every 250ms for faster response
        }
    };

    // Try to restore immediately when DOM is ready
    restoreLanguage();

    // Also try after Google Translate initializes
    window.addEventListener('load', () => {
        setTimeout(restoreLanguage, 500);
    });

    // MutationObserver to aggressively hide Google Translate Banner
    const observer = new MutationObserver(() => {
        const banner = document.querySelector('.goog-te-banner-frame');
        if (banner) {
            banner.style.setProperty('display', 'none', 'important');
        }
        if (document.body.style.top !== '0px' && document.body.style.top !== '') {
            document.body.style.setProperty('top', '0px', 'important');
        }

        // Google also adds a margin to the html element
        if (document.documentElement.style.marginTop !== '0px' && document.documentElement.style.marginTop !== '') {
            document.documentElement.style.setProperty('margin-top', '0px', 'important');
        }

        // Hide any other Google Translate overlays
        const skiptranslate = document.querySelectorAll('.skiptranslate');
        skiptranslate.forEach(el => {
            if (el.tagName === 'IFRAME') {
                el.style.setProperty('display', 'none', 'important');
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        childList: true,
        subtree: true
    });

    // Ensure the Google script is actually loaded
    const checkGoogleScript = () => {
        if (!document.querySelector('script[src*="translate.google.com"]')) {
            console.warn("Google Translate script missing! Attempting to inject...");
            const script = document.createElement('script');
            script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            document.body.appendChild(script);
        }
    };
    checkGoogleScript();

    // Event listeners
    const openBtn = document.getElementById('lang-selector-btn');
    if (openBtn) {
        openBtn.onclick = (e) => {
            e.preventDefault();
            overlay.classList.add('active');
            searchInput.focus();
        };
    }

    // Handle dynamically added buttons (for mobile menu)
    document.addEventListener('click', (e) => {
        if (e.target.closest('#lang-selector-btn')) {
            e.preventDefault();
            overlay.classList.add('active');
            searchInput.focus();
        }
    });

    closeBtn.onclick = () => overlay.classList.remove('active');
    overlay.onclick = (e) => {
        if (e.target === overlay) overlay.classList.remove('active');
    };

    searchInput.oninput = (e) => renderLanguages(e.target.value);

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') overlay.classList.remove('active');
    });

    renderLanguages();

    // Intercept all internal link clicks to preserve language
    const preserveLanguageOnNavigation = () => {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href) {
                const savedLang = localStorage.getItem('selectedLanguage');
                if (savedLang && savedLang !== 'en') {
                    const url = new URL(link.href);
                    // Only modify internal links
                    if (url.hostname === window.location.hostname) {
                        // Add language as hash parameter
                        url.hash = `googtrans=/en/${savedLang}`;
                        link.href = url.toString();
                    }
                }
            }
        }, true); // Use capture phase to catch all clicks
    };

    preserveLanguageOnNavigation();

    // Check for language in URL hash on page load
    const checkUrlLanguage = () => {
        const hash = window.location.hash;
        if (hash.includes('googtrans=')) {
            const match = hash.match(/googtrans=\/en\/([^&/#]+)/);
            if (match && match[1]) {
                const langCode = match[1];
                localStorage.setItem('selectedLanguage', langCode);
                console.log('Language from URL:', langCode);
            }
        }
    };

    checkUrlLanguage();
});
