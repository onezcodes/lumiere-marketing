/**
 * Site-wide settings. Set `appStoreUrl` when the app is live; until then the buttons say
 * "Coming soon". Prices come from the app's server, so the numbers live here only, in one place.
 */
export const site = {
    // The public address, with no trailing slash. Canonical links, hreflang, the share image and
    // the sitemap are all built from it: change it here when the domain is decided, then rebuild.
    siteUrl: 'https://lumiere-marketing.pages.dev',
    appStoreUrl: null,
    supportEmail: 'support@lumiere.app',
    privacyUrl: '#',
    termsUrl: '#',
    poweredByUrl: 'https://onezcodes.com',
};

export const pricing = {
    mmkPerCredit: 100,
    preparedReadingCredits: 100,
    plusDiscountPercent: 5,
    readerSharePercent: 90,
    answerHours: 72,
};
