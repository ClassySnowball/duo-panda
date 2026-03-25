const LANG_CODE_MAP: Record<string, string> = {
  Polish: 'pl-PL',
  Dutch: 'nl-NL',
  English: 'en-US',
};

export function speak(text: string, lang: string): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANG_CODE_MAP[lang] || 'en-US';
  utterance.rate = 0.85;
  window.speechSynthesis.speak(utterance);
}
