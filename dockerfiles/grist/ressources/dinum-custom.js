// ========================
// START dialog
// ========================
(function maintainanceDialog() {
  // CONFIGURER ICI
  const config = {
    // CEST = heure d'été (+0200), CET = heure d'hiver ().
    selectedTz: 'CEST',

    // Date du début de la maintenance
    startDateWithoutTimezone: '2024-04-10T13:00:00',

    // Durée de la maitenance prévue (en minutes).
    // ASTUCE: Si la maintenance dure moins longtemps que prévu, réduire a postériori la valeur de cette variable de sorte à ce qu'elle n'apparaisse plus.
    // Pas besoin de committer ensuite le changement dans le repo.
    maintainanceDurationMinutes: 60,
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

  function showAgreementDialog() {
    const { termsOfServiceUrl } = window.gristConfig;
    if (!termsOfServiceUrl) {
      return;
    }

    const dialog = document.createElement('dialog');
    dialog.id = 'agreementPopin';
    const cguLinkHtml = makeLink("les conditions d'utilisation", termsOfServiceUrl).outerHTML;
    dialog.innerHTML = `
      <p>
        Veuillez accepter ${cguLinkHtml} de Grist avant de continuer.
      </p>
      <p>
        Vous pourrez les retrouvez à tout moment via le lien en bas<br>
        à gauche de la page d'accueil de Grist.
      </p>
      <form method="dialog">
        <p>
          <input type="checkbox" id="jaccepte">
          <label for="jaccepte">J'ai lu et j'accepte sans réserve ${cguLinkHtml}</label>
        </p>
        <button disabled id="fermerPopinAgreement">Poursuivre sur Grist</button>
      </form>
    `;
    document.body.appendChild(dialog);
    document.getElementById('fermerPopinAgreement').onclick = function onMessageUnderstood() {
      localStorage.gcuAgreementDate = new Date().toISOString();
    }
    document.getElementById('jaccepte').onchange = function (ev) {
      document.getElementById('fermerPopinAgreement').disabled = !ev.target.checked;
    }
    dialog.showModal();
  }

  if (!localStorage.gcuAgreementDate) {
    window.addEventListener('load', showAgreementDialog);
  }
})();

// ========================
// END dialog
// ========================

// ========================
// START gauffre
// ========================
window.addEventListener('load', async (event) => {
  await waitForElm('body.interface-full');
  const appObs = gristApp.topAppModel && gristApp.topAppModel.appObs;
  if (!appObs) {
    return;
  }
  // appObs is not populated at that point, listen for the observer to their first change
  let listener;
  listener = appObs.addListener( async (appObs) => {
    // Gauffre must be displayed only in home pages
    if (appObs.pageType.get() !== "home"){
      return 1;
    }
    // We wait for header bar to be available in DOM to insert Gauffre in it
    await waitForElm('.test-top-header');

    // Create gauffre button Tag
    const gristBar = document.getElementsByClassName('test-top-header')[0];
    const gauffreDiv = document.createElement('div');
    const gauffreButton = document.createElement('button');
    const gauffreText = "Les services de La Suite numérique";

    gauffreDiv.className = 'gauffre-container';
    gauffreButton.type = "button";
    gauffreButton.className = "lasuite-gaufre-btn lasuite-gaufre-btn--vanilla js-lasuite-gaufre-btn";
    gauffreButton.title = gauffreText;
    gauffreButton.text = gauffreText;
    gauffreDiv.appendChild(gauffreButton);
    gristBar.insertBefore(gauffreDiv, gristBar.lastChild);

    // Create gauffre script Tag
    const gauffreScript = document.createElement('script');

    gauffreScript.id = "lasuite-gaufre-script";
    gauffreScript.setAttribute('async', true);
    gauffreScript.setAttribute('defer', true);
    gauffreScript.src = "https://integration.lasuite.numerique.gouv.fr/api/v1/gaufre.js";
    document.head.insertBefore(gauffreScript, document.head.lastChild);

    // Create DSFR Title
    const appTitle = document.createElement('p');
    appTitle.classList.add("fr-header__service-title", "lasuite-header__service-title");
    appTitle.innerText = "Tableur collaboratif (Grist)";
    gristBar.insertBefore(appTitle, gristBar.firstChild);

    // Create beta-tag
    const betaTag = document.createElement('p');
    betaTag.className = "beta-tag";
    betaTag.innerText = "beta";
    appTitle.after(betaTag);

    // Should be disposed so we only listen for changes once, but failed to achieve doing that.
    // listener.dispose();
  });
});

// from https://stackoverflow.com/a/61511955
function waitForElm(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

// ========================
// END gauffre
// ========================
