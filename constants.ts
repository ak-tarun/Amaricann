
import { SocialLinkStatus } from './types';

export const API_BASE_URL = 'http://localhost:8000/api'; // Assuming Laravel backend is on localhost:8000

export const JWT_TOKEN_KEY = 'aab_jwt_token';
export const USER_INFO_KEY = 'aab_user_info';

export const DEFAULT_SOCIAL_LINKS = [
  { platform: 'Facebook', icon: 'fab fa-facebook-f', url: 'https://facebook.com', status: SocialLinkStatus.ACTIVE },
  { platform: 'Instagram', icon: 'fab fa-instagram', url: 'https://instagram.com', status: SocialLinkStatus.ACTIVE },
  { platform: 'YouTube', icon: 'fab fa-youtube', url: 'https://youtube.com', status: SocialLinkStatus.ACTIVE },
  { platform: 'LinkedIn', icon: 'fab fa-linkedin-in', url: 'https://linkedin.com', status: SocialLinkStatus.ACTIVE },
  { platform: 'X', icon: 'fab fa-twitter', url: 'https://x.com', status: SocialLinkStatus.ACTIVE },
];

export const UPI_QR_PLACEHOLDER = 'https://picsum.photos/300/300'; // Placeholder for UPI QR Code
export const DEFAULT_INSTITUTE_LOGO = 'https://picsum.photos/100/100?grayscale'; // Placeholder for institute logo

// Admin Settings Keys
export const SETTING_KEYS = {
  INSTITUTE_NAME: 'institute_name',
  INSTITUTE_CONTACT_EMAIL: 'institute_contact_email',
  INSTITUTE_CONTACT_PHONE: 'institute_contact_phone',
  INSTITUTE_ADDRESS: 'institute_address',
  INSTITUTE_LOGO_URL: 'institute_logo_url',
  INSTITUTE_FAVICON_URL: 'institute_favicon_url',
  FOOTER_TEXT: 'footer_text',
  THEME_COLOR_PRIMARY: 'theme_color_primary', // Example: #4299E1
  UPI_ID: 'upi_id',
  UPI_QR_CODE_URL: 'upi_qr_code_url',
  PAYMENT_GATEWAY_KEY_PUBLIC: 'payment_gateway_key_public',
  PAYMENT_GATEWAY_KEY_SECRET: 'payment_gateway_key_secret',
};
