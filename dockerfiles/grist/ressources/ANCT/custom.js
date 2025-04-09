// ========================
// START dialog
// ========================
(function maintainanceDialog() {
  // CONFIGURER ICI
  const config = {
    // CEST = heure d'été (+0200), CET = heure d'hiver (+0100).
    selectedTz: 'CEST',

    // Date du début de la maintenance
    startDateWithoutTimezone: '2025-04-14T12:00:00',

    // Durée de la maitenance prévue (en minutes).
    // ASTUCE: Si la maintenance dure moins longtemps que prévu, réduire a postériori la valeur de cette variable de sorte à ce qu'elle n'apparaisse plus.
    // Pas besoin de committer ensuite le changement dans le repo.
    maintainanceDurationMinutes: 120,
  };
  // FIN CONFIGURER

  const tz = { CEST: '0200', CET: '0100' };

  const maintainanceStartDate = new Date(`${config.startDateWithoutTimezone}+${tz[config.selectedTz]}`);
  const maintainanceEndDate = (function () {
    const date = new Date(maintainanceStartDate); // If I may, Date API is really ackward, especially because it is not immutable
    date.setMinutes(maintainanceStartDate.getMinutes() + config.maintainanceDurationMinutes);
    return date;
  })();


  function showMaitainanceDialog() {
    const dialog = document.createElement('dialog');
    dialog.id = 'maintenancePopin';
    const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'Europe/Paris',
    });
    const timeFormatter = new Intl.DateTimeFormat('fr-FR', {
      timeStyle: 'short',
      timeZone: 'Europe/Paris',
    });

    dialog.innerHTML = `
        <p>
        Une maintenance de Grist est prévue le ${dateFormatter.format(maintainanceStartDate)} heure de Paris
          jusqu'à ${timeFormatter.format(maintainanceEndDate)}, période durant laquelle le service sera momentanément indisponible. <br>
        Pour toute remarque ou question, merci de nous contacter via <a href="mailto:donnees@anct.gouv.fr">donnees@anct.gouv.fr</a></p>
        <p>Merci de votre compréhension</p>
        <form method="dialog">
          <p>
            <input type="checkbox" id="jaiCompris">
            <label for="jaiCompris">J'ai lu et compris, merci de ne plus me montrer ce message</label>
          </p>
          <button disabled id="fermerPopinMaintenance">Fermer</button>
        </form>
    `;
    document.body.appendChild(dialog);
    document.getElementById('fermerPopinMaintenance').onclick = function onMessageUnderstood() {
      localStorage.maintainanceStartDateAgreement = maintainanceStartDate.toISOString();
    }
    document.getElementById('jaiCompris').onchange = function (ev) {
      document.getElementById('fermerPopinMaintenance').disabled = !ev.target.checked;
    }
    dialog.showModal();
  }

  if (Date.now() < maintainanceEndDate.getTime() &&
    (!localStorage.maintainanceStartDateAgreement || localStorage.maintainanceStartDateAgreement !== maintainanceStartDate.toISOString())) {
    window.addEventListener('load', showMaitainanceDialog);
  }

  /**
   * Creates a link (anchor element) given the text and the href (link) passed.
   * We use this method to prevent XSS injection.
   */
  function makeLink(text, href) {
    const a = document.createElement('a');
    a.textContent = text;
    a.href = href;
    a.target = "_blank";
    a.rel = 'nofollow';
    return a;
  }
})();

// ========================
// END dialog
// ========================

// ========================
// START matomo
// ========================
(function matomo() {
  var _paq = window._paq = window._paq || [];
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u="https://stats.beta.gouv.fr/";
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', '109']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g, s);
  })();
})();
// ========================
// END matomo
// ========================
