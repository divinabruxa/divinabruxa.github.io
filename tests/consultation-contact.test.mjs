import assert from 'node:assert/strict';
import test from 'node:test';
import { consultationContactLink } from '../worlds/consultations.js';

test('contato manual inclui protocolo e serviço, sem código privado ou dados da cliente', () => {
  const url = new URL(consultationContactLink({protocol:'DB-20261003-ABCDEFGH', serviceName:'Mesa Real', trackingToken:'SEGREDO-PRIVADO', customerEmail:'cliente@example.com', question:'Pergunta particular'}));
  assert.equal(url.pathname, 'orbedasrealidades@hotmail.com');
  assert.match(url.searchParams.get('body'), /Mesa Real/);
  assert.match(url.searchParams.get('body'), /DB-20261003-ABCDEFGH/);
  assert.doesNotMatch(decodeURIComponent(url.href), /SEGREDO-PRIVADO|cliente@example.com|Pergunta particular/);
});

test('contato sem recibo ou com protocolo inválido permite pedir atendimento sem simular registro', () => {
  for (const receipt of [null, {protocol:'invalido',serviceName:'Mesa Real'}]) {
    const url = new URL(consultationContactLink(receipt));
    assert.match(url.searchParams.get('body'), /conhecer os formatos/);
    assert.doesNotMatch(url.searchParams.get('body'), /Registrei|Protocolo/);
  }
});
