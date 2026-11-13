/* Moteur musical « lounge feutré » du Chêne (contrebasse, piano électrique, pulsation très douce), composé en direct
   par le navigateur (Web Audio), sans fichier ni droits. Copie conforme du moteur de l'espace client CHÊNE GROUP. */
export const BPM = 116;
export const TEMPS = 60 / BPM;
const CROCHE = TEMPS / 2;
const hz = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

// ii - V - I - vi, voix serrées, couleur jazz : Ré m9, Sol 13, Do maj9, La m9.
const ACCORDS = [[50, 53, 57, 60, 64], [55, 59, 64, 65, 69], [48, 52, 55, 59, 62], [45, 48, 52, 55, 59]];
const BASSES = [38, 43, 36, 33];
const MELODIE = [74, 76, 79, 81, 84, 86]; // pentatonique douce, au-dessus des accords

export type Chaine = { ctx: BaseAudioContext; maitre: GainNode; pompe: GainNode; reverb: AudioNode; echo: AudioNode; bruit: AudioBuffer };

/* Réverbération d'espace : réponse impulsionnelle de bruit qui s'éteint en ~2,8 s. */
function reverberation(ctx: BaseAudioContext) {
  const duree = 2.8, n = Math.floor(ctx.sampleRate * duree), ir = ctx.createBuffer(2, n, ctx.sampleRate);
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3.2); }
  const conv = ctx.createConvolver(); conv.buffer = ir; return conv;
}

export function construire(ctx: BaseAudioContext, sortie: AudioNode, volume = 0.55): Chaine {
  const maitre = ctx.createGain(); maitre.gain.value = volume;
  const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -20; comp.ratio.value = 2.5; comp.attack.value = 0.01; comp.release.value = 0.2;
  const chaleur = ctx.createBiquadFilter(); chaleur.type = "highshelf"; chaleur.frequency.value = 6000; chaleur.gain.value = -6; // adoucit les aigus
  maitre.connect(chaleur); chaleur.connect(comp); comp.connect(sortie);
  const conv = reverberation(ctx), retourRev = ctx.createGain(); retourRev.gain.value = 0.35;
  conv.connect(retourRev); retourRev.connect(maitre);
  const delai = ctx.createDelay(1); delai.delayTime.value = TEMPS * 0.75;
  const fb = ctx.createGain(); fb.gain.value = 0.32; const filtreEcho = ctx.createBiquadFilter(); filtreEcho.type = "lowpass"; filtreEcho.frequency.value = 2500;
  delai.connect(filtreEcho); filtreEcho.connect(fb); fb.connect(delai); filtreEcho.connect(maitre); filtreEcho.connect(conv);
  const pompe = ctx.createGain(); pompe.connect(maitre); pompe.connect(conv);
  const bruit = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const d = bruit.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return { ctx, maitre, pompe, reverb: conv, echo: delai, bruit };
}

function kick(c: Chaine, t: number) {
  const { ctx } = c, o = ctx.createOscillator(), g = ctx.createGain();
  o.frequency.setValueAtTime(95, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.12);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.22, t + 0.008); g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
  o.connect(g); g.connect(c.maitre); o.start(t); o.stop(t + 0.5);
  c.pompe.gain.setValueAtTime(0.75, t); c.pompe.gain.linearRampToValueAtTime(1, t + TEMPS * 0.9); // respiration légère // respiration « sidechain »
}
function bruitFiltre(c: Chaine, t: number, type: BiquadFilterType, freq: number, vol: number, duree: number, vers: AudioNode = c.maitre) {
  const { ctx } = c, s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  s.buffer = c.bruit; f.type = type; f.frequency.value = freq;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0005, t + duree);
  s.connect(f); f.connect(g); g.connect(vers); s.start(t, Math.random() * 0.5); s.stop(t + duree + 0.05);
}
/* Piano électrique feutré (façon Rhodes) : fondamentale + harmonique douce, attaque rapide, longue extinction, léger trémolo. */
function rhodes(c: Chaine, t: number, n: number, vol: number, duree: number) {
  const { ctx } = c, g = ctx.createGain();
  for (const [mult, amp] of [[1, 1], [2, 0.18], [3.01, 0.05]] as const) {
    const o = ctx.createOscillator(), og = ctx.createGain();
    o.type = "sine"; o.frequency.value = hz(n) * mult; o.detune.value = (Math.random() - 0.5) * 6; og.gain.value = amp;
    o.connect(og); og.connect(g); o.start(t); o.stop(t + duree + 0.5);
  }
  const trem = ctx.createOscillator(), tg = ctx.createGain(); trem.frequency.value = 4.5; tg.gain.value = vol * 0.18;
  trem.connect(tg); tg.connect(g.gain); trem.start(t); trem.stop(t + duree + 0.5);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0008, t + duree);
  g.connect(c.pompe);
}
/* Contrebasse : note pincée, ronde et boisée (fondamentale + légère harmonique, attaque douce, extinction naturelle). */
function sub(c: Chaine, t: number, n: number, duree: number) {
  const { ctx } = c, g = ctx.createGain(), f = ctx.createBiquadFilter();
  f.type = "lowpass"; f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(260, t + 0.25);
  for (const [mult, amp, type] of [[1, 1, "sine"], [2, 0.22, "triangle"]] as const) {
    const o = ctx.createOscillator(), og = ctx.createGain();
    o.type = type; o.frequency.value = hz(n) * mult; og.gain.value = amp;
    o.connect(og); og.connect(f); o.start(t); o.stop(t + duree + 0.6);
  }
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.42, t + 0.03); g.gain.exponentialRampToValueAtTime(0.0008, t + duree + 0.5);
  f.connect(g); g.connect(c.maitre); g.connect(c.reverb);
}
function pluck(c: Chaine, t: number, n: number) {
  const { ctx } = c, o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  o.type = "triangle"; o.frequency.value = hz(n); f.type = "lowpass"; f.frequency.setValueAtTime(3200, t); f.frequency.exponentialRampToValueAtTime(600, t + 0.4);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.05, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0005, t + 0.9);
  o.connect(f); f.connect(g); g.connect(c.maitre); g.connect(c.echo); g.connect(c.reverb); o.start(t); o.stop(t + 1);
}

/* Joue le pas « pas » (une croche) au temps t. 8 croches par mesure, 4 mesures par cycle ; l'intro (4 premières mesures)
   pose les accords seuls, puis le beat entre : effet d'ouverture. */
export function jouerPas(c: Chaine, pas: number, t: number, alea: () => number = Math.random) {
  const p = pas % 8, mesure = Math.floor(pas / 8), ac = mesure % 4, intro = mesure < 2;
  const swing = p % 2 === 1 ? CROCHE * 0.12 : 0;
  if (p === 0) ACCORDS[ac].forEach((n, i) => rhodes(c, t + i * 0.012, n, intro ? 0.06 : 0.05, TEMPS * 3.6));
  if (p === 5 && !intro) ACCORDS[ac].slice(2).forEach((n) => rhodes(c, t + swing, n, 0.03, TEMPS * 1.2));
  if (!intro) {
    if (p === 0 || p === 4) kick(c, t);                                              // pulsation à peine sensible
    if (p === 3 || p === 7) bruitFiltre(c, t + swing, "highpass", 9500, 0.025, 0.05); // charleston très discret
    // Contrebasse : la ligne qui porte le morceau, posée et chaleureuse.
    if (p === 0) sub(c, t, BASSES[ac], CROCHE * 3);
    if (p === 3) sub(c, t + swing, BASSES[ac] + 7, CROCHE * 1.5);
    if (p === 6) sub(c, t, BASSES[ac] + 12, CROCHE * 1.4);
  }
  if (mesure % 2 === 1 && (p === 1 || p === 6) && alea() < 0.6) pluck(c, t + swing, MELODIE[Math.floor(alea() * MELODIE.length)]);
}

/* Extrait audio hors ligne (WAV) : pour faire écouter l'ambiance sans ouvrir l'espace. */
export async function rendreExtrait(secondes: number): Promise<Blob> {
  const sr = 44100, off = new OfflineAudioContext(2, sr * secondes, sr);
  const c = construire(off, off.destination, 0.26); // même volume que dans l'espace client
  let s = 1; const alea = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let pas = 0, t = 0.1; t < secondes - 0.5; pas++, t += CROCHE) jouerPas(c, pas, t, alea);
  const buf = await off.startRendering();
  const n = buf.length, wav = new ArrayBuffer(44 + n * 4), v = new DataView(wav);
  const w = (o: number, x: string) => [...x].forEach((ch, i) => v.setUint8(o + i, ch.charCodeAt(0)));
  w(0, "RIFF"); v.setUint32(4, 36 + n * 4, true); w(8, "WAVE"); w(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 2, true);
  v.setUint32(24, sr, true); v.setUint32(28, sr * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true); w(36, "data"); v.setUint32(40, n * 4, true);
  const L = buf.getChannelData(0), R = buf.getChannelData(1);
  for (let i = 0, o = 44; i < n; i++, o += 4) { for (const [k, ch] of [[0, L], [2, R]] as const) { const x = Math.max(-1, Math.min(1, ch[i])); v.setInt16(o + k, x < 0 ? x * 0x8000 : x * 0x7fff, true); } }
  return new Blob([wav], { type: "audio/wav" });
}

/* ───────── Version courte jouée à la connexion ─────────
   Le même lounge feutré, limité à ~12 s : accords seuls, le rythme entre, puis fondu jusqu'au silence. */
export const DUREE_OUVERTURE = 12;
const FONDU = 3.5;

/* Programme toute la version courte d'un coup, fondu de sortie compris. Le site joue 5 s en partant de l'entrée
   du rythme (premierPas = 8) ; l'espace client joue 12 s depuis le début. */
export function jouerOuverture(c: Chaine, t0: number, volume: number, duree = DUREE_OUVERTURE, premierPas = 0, alea: () => number = Math.random) {
  for (let pas = premierPas, t = t0; t < t0 + duree - 0.3; pas++, t += CROCHE) jouerPas(c, pas, t, alea);
  const g = c.maitre.gain, fondu = Math.min(FONDU, duree * 0.5);
  g.setValueAtTime(0.0001, t0); g.linearRampToValueAtTime(volume, t0 + Math.min(1.5, duree * 0.2));
  g.setValueAtTime(volume, t0 + duree - fondu); g.linearRampToValueAtTime(0, t0 + duree);
}

/* Version courte rendue hors ligne (WAV), pour l'écouter depuis le poste du cabinet. */
export async function rendreOuverture(): Promise<Blob> {
  const sr = 44100, off = new OfflineAudioContext(2, sr * (DUREE_OUVERTURE + 3), sr);
  const c = construire(off, off.destination, 0);
  jouerOuverture(c, 0.1, 0.26);
  return wav(await off.startRendering());
}
function wav(buf: AudioBuffer) {
  const n = buf.length, sr = buf.sampleRate, b = new ArrayBuffer(44 + n * 4), v = new DataView(b);
  const w = (o: number, x: string) => [...x].forEach((ch, i) => v.setUint8(o + i, ch.charCodeAt(0)));
  w(0, "RIFF"); v.setUint32(4, 36 + n * 4, true); w(8, "WAVE"); w(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 2, true);
  v.setUint32(24, sr, true); v.setUint32(28, sr * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true); w(36, "data"); v.setUint32(40, n * 4, true);
  const L = buf.getChannelData(0), R = buf.getChannelData(1);
  for (let i = 0, o = 44; i < n; i++, o += 4) for (const [k, ch] of [[0, L], [2, R]] as const) { const x = Math.max(-1, Math.min(1, ch[i])); v.setInt16(o + k, x < 0 ? x * 0x8000 : x * 0x7fff, true); }
  return new Blob([b], { type: "audio/wav" });
}
