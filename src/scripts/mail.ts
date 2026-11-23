/**
 * Le mail n'est pas écrit en clair dans le HTML (contre les robots).
 * Il est stocké inversé + en base64 dans data-mail, et reconstruit ici.
 */
export function decodeMail(encoded: string): string {
  return [...atob(encoded)].reverse().join('');
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function initMail() {
  document.querySelectorAll<HTMLElement>('[data-mail]').forEach((block) => {
    const mail = decodeMail(block.dataset.mail ?? '');
    if (!mail.includes('@')) return;

    block.querySelectorAll<HTMLElement>('[data-mail-text]').forEach((el) => (el.textContent = mail));
    block.querySelectorAll<HTMLAnchorElement>('[data-mail-link]').forEach((a) => {
      a.href = `mailto:${mail}`;
      a.hidden = false;
    });

    block.querySelectorAll<HTMLButtonElement>('[data-mail-copy]').forEach((button) => {
      button.hidden = false;
      const labelEl = button.querySelector<HTMLElement>('[data-copy-label]') ?? button;
      const initial = labelEl.textContent;
      button.addEventListener('click', async () => {
        const ok = await copyText(mail);
        if (!ok) return;
        labelEl.textContent = button.dataset.copied ?? 'OK';
        button.classList.add('text-accent');
        setTimeout(() => {
          labelEl.textContent = initial;
          button.classList.remove('text-accent');
        }, 1800);
      });
    });
  });
}
