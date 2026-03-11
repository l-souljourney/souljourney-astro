import { ui, defaultLang } from './ui';

export function getLangFromUrl(url: URL) {
    const [, lang] = url.pathname.split('/');
    if (lang in ui) return lang as keyof typeof ui;
    return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
    return function t(key: keyof typeof ui[typeof defaultLang]) {
        return ui[lang][key] || ui[defaultLang][key];
    }
}

export function getRouteFromUrl(url: URL): string | undefined {
    const pathname = new URL(url).pathname;

    const currentLang = getLangFromUrl(url);

    if (defaultLang === currentLang) {
        return pathname;
    }

    const localePrefix = `/${currentLang}`;
    if (!pathname.startsWith(localePrefix)) {
        return pathname;
    }

    const route = pathname.slice(localePrefix.length);
    return route.startsWith('/') ? route || '/' : `/${route}`;
}
