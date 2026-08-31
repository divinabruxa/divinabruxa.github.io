import './tarot-meanings.js';
import { meaning as fallbackMeaning } from './meaning-engine.js';

const cleanList = value => Array.isArray(value) ? value.filter(item => typeof item === 'string' && item.trim()) : [];

export function dailyMeaning(card) {
  const source = globalThis.DivinaBruxaTarotMeanings;
  const deep = source?.get?.(card.canonicalId) || source?.cards?.[card.canonicalId] || null;
  if (deep?.orientation === 'normal') return Object.freeze({
    keywords: cleanList(deep.keywords), essence: deep.essence, light: deep.light, tension: deep.tension,
    love: deep.love, relationships: deep.relationships, career: deep.career, money: deep.money,
    spirituality: deep.spirituality, advice: deep.advice, symbols: cleanList(deep.symbols),
    reflectionQuestion: deep.reflectionQuestion, action: deep.action
  });
  const fallback = fallbackMeaning(card, false);
  return Object.freeze({ keywords: String(fallback.keywords || '').split(',').map(item => item.trim()).filter(Boolean), essence: fallback.message, light: fallback.light, tension: fallback.shadow, love: fallback.emotional, relationships: fallback.emotional, career: fallback.practical, money: fallback.practical, spirituality: fallback.spiritual, advice: fallback.practical, symbols: [], reflectionQuestion: fallback.question, action: fallback.practical });
}
