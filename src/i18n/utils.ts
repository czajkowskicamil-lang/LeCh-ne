import { ui, defaultLang, type Lang } from './ui';

/**
 * Détermine la langue à partir de l'URL.
 * FR est à la racine (/…), EN est préfixé (/en/…).
 */
export function getLangFromUrl(url: URL): Lang {
  const [, seg] = url.pathname.split('/');
  if (seg === 'en') return 'en';
  return defaultLang;
}

/**
 * Renvoie une fonction de traduction t('clé') pour la langue donnée.
 * Repli automatique sur le français si la clé manque en anglais.
 */
export function useTranslations(lang: Lang) {
  return function t(key: string): string {
    return (ui[lang] as Record<string, string>)[key] ?? (ui[defaultLang] as Record<string, string>)[key] ?? key;
  };
}

/**
 * Traduit un chemin FR vers la langue cible.
 * Le français reste tel quel ; l'anglais est préfixé par /en.
 * Ex : localizePath('/parcours', 'en') -> '/en/parcours'
 */
export function localizePath(path: string, lang: Lang): string {
  const clean = stripLangPrefix(path);
  if (lang === 'en') {
    return clean === '/' ? '/en/' : `/en${clean}`;
  }
  return clean;
}

/**
 * Retire le préfixe /en d'un chemin pour retrouver la version FR canonique.
 * Ex : '/en/parcours' -> '/parcours' ; '/en/' -> '/' ; '/en' -> '/'
 */
export function stripLangPrefix(path: string): string {
  if (path === '/en' || path === '/en/') return '/';
  if (path.startsWith('/en/')) return path.slice(3); // enlève '/en'
  return path;
}

/**
 * Renvoie le chemin équivalent dans l'autre langue, pour le bouton de bascule.
 */
export function alternatePath(currentPath: string, currentLang: Lang): string {
  const target: Lang = currentLang === 'fr' ? 'en' : 'fr';
  return localizePath(currentPath, target);
}
