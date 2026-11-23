/*
 * Chargé (bloquant, très petit) dans le <head> de chaque page.
 * Pose la classe "motion" sur <html> si les animations sont autorisées,
 * pour cacher les éléments AVANT leur animation d'apparition (pas de flash).
 * Filet de sécurité : si les animations n'ont pas démarré après 3 s,
 * on retire la classe et tout le contenu s'affiche.
 */
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  root.classList.add('motion');
  setTimeout(function () {
    if (!root.classList.contains('motion-ready')) root.classList.remove('motion');
  }, 3000);
})();
