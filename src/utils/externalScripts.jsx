import { useEffect } from 'react';

import { getConfig } from '@edx/frontend-platform';

const GTM_SCRIPT_ID = 'hdruk-google-tag-manager';
const ONETRUST_SCRIPT_ID = 'hdruk-onetrust-cdn';
const CONSENT_DEFAULTS_FLAG = '__hdrukConsentDefaultsLoaded';

function appendHeadScript({
  id, src, text, attributes = {},
}) {
  if (!document.head || document.getElementById(id)) {
    return;
  }

  const script = document.createElement('script');
  script.id = id;
  script.type = 'text/javascript';

  if (src) {
    script.src = src;
  }

  if (text) {
    script.text = text;
  }

  Object.entries(attributes).forEach(([name, value]) => {
    script.setAttribute(name, value);
  });

  document.head.appendChild(script);
}

const ConsentManager = () => {
  const {
    GOOGLE_TAG_MANAGER_ID: gtmId,
    ONETRUST_CONSENT_MANAGEMENT: consentManagement,
    ONETRUST_DATA_DOMAIN_SCRIPT: dataDomain,
  } = getConfig();
  const shouldLoadOneTrustDirectly = Boolean(consentManagement && dataDomain);

  useEffect(() => {
    if (!gtmId && !shouldLoadOneTrustDirectly) {
      return;
    }

    if (gtmId) {
      window.dataLayer = window.dataLayer || [];

      if (typeof window.gtag !== 'function') {
        window.gtag = (...args) => {
          window.dataLayer.push(args);
        };
      }

      if (!window[CONSENT_DEFAULTS_FLAG]) {
        window.gtag('set', 'developer_id.dNzMyY2', true);
        window.gtag('consent', 'default', { analytics_storage: 'denied' });
        window.gtag('consent', 'default', { ad_storage: 'denied' });
        window[CONSENT_DEFAULTS_FLAG] = true;
      }
    }

    if (gtmId && consentManagement) {
      window.OptanonWrapper = function OptanonWrapper() {
        const activeGroups = window.OnetrustActiveGroups || '';

        if (activeGroups.indexOf('C0002') !== -1 && typeof window.gtag === 'function') {
          window.gtag('consent', 'update', { analytics_storage: 'granted' });
        }

        if (activeGroups.indexOf('C0004') !== -1 && typeof window.gtag === 'function') {
          window.gtag('consent', 'update', { ad_storage: 'granted' });
        }
      };
    }

    if (shouldLoadOneTrustDirectly) {
      appendHeadScript({
        id: ONETRUST_SCRIPT_ID,
        src: 'https://cdn-ukwest.onetrust.com/scripttemplates/otSDKStub.js',
        attributes: {
          charset: 'UTF-8',
          'data-domain-script': dataDomain,
        },
      });

      if (gtmId && consentManagement && window.OnetrustActiveGroups) {
        window.OptanonWrapper();
      }
    }

    if (gtmId) {
      appendHeadScript({
        id: GTM_SCRIPT_ID,
        text: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
      });
    }
  }, [consentManagement, dataDomain, gtmId, shouldLoadOneTrustDirectly]);

  return null;
};

export default ConsentManager;
