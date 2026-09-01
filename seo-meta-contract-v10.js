// Construtor de metadados; não injeta tags automaticamente.
export function buildCanonical(pathname = '/', language = 'pt-BR') {
  const clean = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const suffix = language === 'pt-BR' ? '' : `?lang=${encodeURIComponent(language)}`;
  return `https://divinabruxa.com.br${clean}${suffix}`;
}

export function buildOpenGraph({ title, description, image, url } = {}) {
  return { title: String(title || ''), description: String(description || ''), image: String(image || ''), url: String(url || '') };
}

export function shouldIndex(route = {}) {
  return route.access === 'public' && route.status === 'published';
}
