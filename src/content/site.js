/**
 * Site-wide settings. Set `appStoreUrl` when the app is live; until then the buttons say
 * "Coming soon". Prices come from the app's server, so the numbers live here only, in one place.
 */
export const site = {
    // The public address, with no trailing slash. Canonical links, hreflang, the share image,
    // robots.txt and the sitemap are all built from it. Rebuild after changing it.
    siteUrl: 'https://lumiere.onezcodes.com',
    appStoreUrl: null,
    supportEmail: 'lumiere@onezcodes.com',
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
    giftCardFeePercent: 5,
};
