/* DIVINA BRUXA — CONTEÚDO DA CARTA DO DIA — V183 */
import './tarot-meanings.js?v=183';
import { meaning as fallbackMeaning } from './meaning-engine.js';

const cleanList = value => Array.isArray(value) ? value.filter(item => typeof item === 'string' && item.trim()) : [];

export function dailyMeaning(card) {
  const source = globalThis.DivinaBruxaTarotMeanings;
  const canonicalIds = [card.canonicalId, String(card.canonicalId || '').replace(/^\d{2}-/, '')];
  const deep = canonicalIds.map(id => source?.get?.(id) || source?.cards?.[id]).find(Boolean) || null;
  if (deep?.orientation === 'normal') return Object.freeze({
    keywords: cleanList(deep.keywords), dailyEnergy: deep.dailyEnergy, essence: deep.essence, light: deep.light, tension: deep.tension,
    love: deep.love, relationships: deep.relationships, career: deep.career, money: deep.money,
    spirituality: deep.spirituality, advice: deep.advice, symbols: cleanList(deep.symbols),
    reflectionQuestion: deep.reflectionQuestion, action: deep.action, responsibleNotice: deep.responsibleNotice
  });
  const fallback = fallbackMeaning(card, false);
  return Object.freeze({ keywords: String(fallback.keywords || '').split(',').map(item => item.trim()).filter(Boolean), dailyEnergy: fallback.message, essence: fallback.message, light: fallback.light, tension: fallback.shadow, love: fallback.emotional, relationships: fallback.emotional, career: fallback.practical, money: fallback.practical, spirituality: fallback.spiritual, advice: fallback.practical, symbols: [], reflectionQuestion: fallback.question, action: fallback.practical, responsibleNotice: 'Use esta leitura como reflexão simbólica, nunca como diagnóstico, garantia ou substituição de orientação profissional.' });
}
