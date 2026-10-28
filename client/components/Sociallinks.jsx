import React from "react";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa6";

// adds https:// when missing
const normalizeUrl = (url) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);

const SocialLinks = ({ links = {} }) => {
  const items = [
    { key: "github", label: "GitHub", icon: FaGithub },
    { key: "linkedin", label: "LinkedIn", icon: FaLinkedin },
    { key: "portfolio", label: "Portfolio", icon: FaGlobe },
  ].filter((i) => links[i.key]);

  if (!items.length) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-3 justify-center sm:justify-start">
      {items.map(({ key, label, icon: Icon }) => (
        <a
          key={key}
          href={normalizeUrl(links[key])}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition-colors"
        >
          <Icon /> {label}
        </a>
      ))}
    </div>
  );
};

export { normalizeUrl };
export default SocialLinks;