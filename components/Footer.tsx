
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SocialLink, SocialLinkStatus } from '../types';
import * as settingsService from '../services/settingsService';
import { DEFAULT_SOCIAL_LINKS, SETTING_KEYS } from '../constants';

const Footer: React.FC = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [footerText, setFooterText] = useState<string>('');

  useEffect(() => {
    const fetchFooterData = async () => {
      const socialResponse = await settingsService.getSocialLinks();
      if (socialResponse.success && socialResponse.data) {
        setSocialLinks(socialResponse.data.filter(link => link.status === SocialLinkStatus.ACTIVE));
      } else {
        setSocialLinks(DEFAULT_SOCIAL_LINKS.filter(link => link.status === SocialLinkStatus.ACTIVE) as SocialLink[]);
      }

      const settingsResponse = await settingsService.getSettings();
      if (settingsResponse.success && settingsResponse.data) {
        const textSetting = settingsResponse.data.find(s => s.key === SETTING_KEYS.FOOTER_TEXT);
        setFooterText(textSetting?.value || `© ${new Date().getFullYear()} American Academy Barhi.`);
      } else {
        setFooterText(`© ${new Date().getFullYear()} American Academy Barhi.`);
      }
    };
    fetchFooterData();
  }, []);

  return (
    <footer className="bg-gray-900 text-white p-6 mt-auto">
      <div className="container mx-auto text-center">
        <div className="flex justify-center gap-4 mb-3">
          {socialLinks.length > 0 ? (
            socialLinks.map(link => (
              <a key={link.platform} href={link.url} target="_blank" rel="noreferrer" aria-label={link.platform}>
                <i className={`${link.icon} text-xl hover:text-blue-400`}></i>
              </a>
            ))
          ) : (
            // Fallback for when no social links are configured or fetched
            DEFAULT_SOCIAL_LINKS.map(link => (
              <a key={link.platform} href={link.url} target="_blank" rel="noreferrer" aria-label={link.platform}>
                <i className={`${link.icon} text-xl hover:text-blue-400`}></i>
              </a>
            ))
          )}
        </div>
        <p className="text-sm">
          {footerText} |
          <Link to="/privacy-policy" className="underline ml-1 hover:text-blue-400">Privacy Policy</Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
