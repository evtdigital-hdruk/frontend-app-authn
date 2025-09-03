import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  marketingDetails: {
    id: 'marketingPreferences.marketingDetails',
    description: 'Description of the marketing communications available',
    defaultMessage: 'I would like the following updates by email:',
  },
  marketingDisclaimer: {
    id: 'marketingPreferences.marketingDisclaimer',
    description: 'Details about unsubscribing and privacy policy.',
    defaultMessage: 'You may unsubscribe from these communications at any time. '
      + 'For more information on how to unsubscribe, our privacy practices, '
      + 'and how we are committed to protecting and respecting your privacy, '
      + 'please review our {privacyPolicyLink}.',
  },
  marketingPrivacyPolicyLink: {
    id: 'marketingPreferences.marketingPrivacyPolicyLink',
    description: 'Privacy Policy',
    defaultMessage: 'Privacy Policy',
  },
});

export default messages;
