/* DIVINA BRUXA — ESTADOS CRÍTICOS DE CONTA V201 · PT / EN / ES */
const COPY = Object.freeze({
  pt: Object.freeze({
    offline:'Sem conexão com o servidor seguro. Seus dados locais continuam protegidos; tente novamente quando estiver online.',
    slowNetwork:'Conexão lenta detectada. A Conta pode levar um pouco mais, sem repetir envios automaticamente.',
    tooMany:'Muitas tentativas em pouco tempo. Aguarde um minuto e tente novamente.',
    verifyEmail:'Confirme o e-mail enviado antes de entrar.',
    delayedEmail:'O e-mail pode levar alguns minutos. Confira também spam e lixo eletrônico antes de solicitar outro link.',
    invalidCredentials:'E-mail ou senha não conferem.',
    weakPassword:'Use uma senha forte com pelo menos 12 caracteres.',
    syncTooLarge:'O Diário está grande demais para esta sincronização. Baixe uma cópia privada e tente em partes.',
    recentAuth:'Confirme a senha novamente e repita a ação em até cinco minutos.',
    mfa:'Esta conta exige uma verificação MFA recente.',
    suspendedError:'Esta conta está suspensa. O conteúdo local foi separado e nenhum dado de outra conta ficou acessível.',
    expiredError:'Sua sessão expirou. Entre novamente para restaurar o conteúdo local separado desta conta.',
    generic:'Não foi possível concluir agora. Nenhum dado local foi apagado.',
    suspendedTitle:'Conta temporariamente suspensa',
    suspendedBody:'O acesso à nuvem e a todas as sessões protegidas foi bloqueado. Seus dados locais permaneceram separados neste aparelho.',
    deletionTitle:'Exclusão em andamento',
    deletionBody:'Novas sincronizações estão bloqueadas enquanto o pedido de exclusão é concluído.',
    expiredTitle:'Sessão expirada com segurança',
    expiredBody:'Entre novamente para restaurar somente os dados desta conta neste aparelho.',
    support:'Consulte o canal oficial em Contato. Nunca envie sua senha ou código MFA.',
    passwordChanged:'Senha alterada. As outras sessões foram revogadas e este aparelho continua conectado.',
    passwordChangedPartial:'Senha alterada. Não foi possível confirmar a revogação dos outros aparelhos; use “Sair de todos” agora.',
    signedOutAll:'Todas as sessões foram revogadas. Entre novamente apenas nos aparelhos que reconhecer.',
    controlPending:'A camada V201 ainda aguarda ativação no STAGING; a proteção V189 continua ativa.'
  }),
  en: Object.freeze({
    offline:'The secure server is unreachable. Your local data remains protected; try again when you are online.',
    slowNetwork:'A slow connection was detected. Account actions may take longer and will not be submitted twice automatically.',
    tooMany:'Too many attempts in a short period. Wait one minute and try again.',
    verifyEmail:'Confirm the email we sent before signing in.',
    delayedEmail:'The email may take a few minutes. Check spam and junk before requesting another link.',
    invalidCredentials:'The email or password does not match.',
    weakPassword:'Use a strong password with at least 12 characters.',
    syncTooLarge:'The Journal is too large for this sync. Download a private copy and retry in smaller parts.',
    recentAuth:'Confirm your password again and repeat the action within five minutes.',
    mfa:'This account requires a recent MFA verification.',
    suspendedError:'This account is suspended. Local content was separated and no other account data is accessible.',
    expiredError:'Your session expired. Sign in again to restore this account’s separated local content.',
    generic:'This could not be completed now. No local data was deleted.',
    suspendedTitle:'Account temporarily suspended',
    suspendedBody:'Cloud access and protected sessions were blocked. Local data remains separated on this device.',
    deletionTitle:'Deletion in progress',
    deletionBody:'New syncs are blocked while the deletion request is completed.',
    expiredTitle:'Session expired safely',
    expiredBody:'Sign in again to restore only this account’s data on this device.',
    support:'Use the official Contact channel. Never send your password or MFA code.',
    passwordChanged:'Password changed. Other sessions were revoked and this device remains signed in.',
    passwordChangedPartial:'Password changed. Other-device revocation could not be confirmed; use “Sign out everywhere” now.',
    signedOutAll:'All sessions were revoked. Sign in again only on devices you recognize.',
    controlPending:'The V201 layer is awaiting STAGING activation; V189 protection remains active.'
  }),
  es: Object.freeze({
    offline:'No hay conexión con el servidor seguro. Tus datos locales siguen protegidos; inténtalo cuando estés en línea.',
    slowNetwork:'Se detectó una conexión lenta. La Cuenta puede tardar más y no repetirá envíos automáticamente.',
    tooMany:'Demasiados intentos en poco tiempo. Espera un minuto e inténtalo de nuevo.',
    verifyEmail:'Confirma el correo enviado antes de iniciar sesión.',
    delayedEmail:'El correo puede tardar unos minutos. Revisa spam y correo no deseado antes de pedir otro enlace.',
    invalidCredentials:'El correo o la contraseña no coinciden.',
    weakPassword:'Usa una contraseña segura de al menos 12 caracteres.',
    syncTooLarge:'El Diario es demasiado grande para esta sincronización. Descarga una copia privada y prueba en partes.',
    recentAuth:'Confirma otra vez tu contraseña y repite la acción en cinco minutos.',
    mfa:'Esta cuenta exige una verificación MFA reciente.',
    suspendedError:'Esta cuenta está suspendida. El contenido local fue separado y no hay acceso a datos de otra cuenta.',
    expiredError:'Tu sesión venció. Inicia sesión de nuevo para restaurar el contenido local separado de esta cuenta.',
    generic:'No fue posible completar la acción. No se borró ningún dato local.',
    suspendedTitle:'Cuenta temporalmente suspendida',
    suspendedBody:'Se bloquearon el acceso a la nube y las sesiones protegidas. Los datos locales siguen separados en este dispositivo.',
    deletionTitle:'Eliminación en curso',
    deletionBody:'Las nuevas sincronizaciones están bloqueadas mientras finaliza la solicitud de eliminación.',
    expiredTitle:'La sesión venció de forma segura',
    expiredBody:'Inicia sesión de nuevo para restaurar solamente los datos de esta cuenta en este dispositivo.',
    support:'Usa el canal oficial de Contacto. Nunca envíes tu contraseña ni tu código MFA.',
    passwordChanged:'Contraseña cambiada. Se revocaron las otras sesiones y este dispositivo sigue conectado.',
    passwordChangedPartial:'Contraseña cambiada. No se pudo confirmar la revocación de otros dispositivos; usa “Cerrar todas las sesiones”.',
    signedOutAll:'Se revocaron todas las sesiones. Inicia sesión solo en dispositivos reconocidos.',
    controlPending:'La capa V201 espera activación en STAGING; la protección V189 sigue activa.'
  })
});

export const accountLocaleV201 = () => {
  let candidate = String(globalThis.document?.documentElement?.lang || 'pt').toLowerCase();
  try { candidate = new URL(globalThis.location?.href || 'https://divinabruxa.com.br/').searchParams.get('lang') || candidate; } catch {}
  return /^en\b/i.test(candidate) ? 'en' : /^es\b/i.test(candidate) ? 'es' : 'pt';
};

export const accountStateTextV201 = key => COPY[accountLocaleV201()]?.[key] || COPY.pt[key] || '';
export const ACCOUNT_STATE_COPY_V201 = COPY;
