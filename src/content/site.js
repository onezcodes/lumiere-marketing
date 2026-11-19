/**
 * Site-wide settings. Set `appStoreUrl` / `playStoreUrl` when each store listing is live; until then the buttons say
 * "Coming soon". Prices come from the app's server, so the numbers live here only, in one place.
 */
export const site = {
    // The public address, with no trailing slash. Canonical links, hreflang, the share image,
    // robots.txt and the sitemap are all built from it. Rebuild after changing it.
    siteUrl: 'https://lumiere.onezcodes.com',
    appStoreUrl: null,
    playStoreUrl: null,
    // TestFlight public link for /beta/ (https://testflight.apple.com/join/…). Null shows "Opening soon"
    // when there is no public link.
    testFlightUrl: 'https://testflight.apple.com/join/DuWyRMqN',
    // Android test build for /android-beta/. The APK is too big for the site's static files (Cloudflare
    // serves up to 25 MB each), so it lives elsewhere: paste a direct download link here. Null shows
    // "Opening soon". Update the version and size with each new build.
    // Google Drive direct-download form (https://drive.usercontent.google.com/download?id=<file id>&export=download),
    // not the /file/d/…/view link, which opens Drive's preview page. The file must be shared as
    // "Anyone with the link", or people land on a Google sign-in page.
    androidApkUrl: 'https://drive.usercontent.google.com/download?id=17_BBQ-WtgxNi73Cs1VX7YwMh-mnOcg3T&export=download',
    androidApkVersion: '1.0.1',
    androidApkSize: '90 MB',
    supportEmail: 'lumiere@onezcodes.com',
    privacyUrl: '/privacy/',
    termsUrl: '/terms/',
    poweredByUrl: 'https://onezcodes.com',
};

export const pricing = {
    mmkPerCredit: 100,
    preparedReadingCredits: 100,
    plusDiscountPercent: 5,
    readerSharePercent: 90,
    answerHours: 72,
    giftCardFeePercent: 5,
};
