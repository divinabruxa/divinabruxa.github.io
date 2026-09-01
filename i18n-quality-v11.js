// Utilitários de localização; não substitui revisão humana.
export function localeNumber(value, locale = 'pt-BR') {
  return new Intl.NumberFormat(locale).format(value);
}

export function localeCurrency(value, locale = 'pt-BR', currency = 'BRL') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}

export function translationLabel(status, sourceLanguage = 'pt-BR') {
  return status === 'approved' || status === 'published' ? '' : `Conteúdo disponível em ${sourceLanguage}`;
}
