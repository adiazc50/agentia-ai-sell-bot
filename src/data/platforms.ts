import {
  MessageCircle, Bot, Clock, Shield, BarChart3, Zap, Users,
  CreditCard, Database, Contact, Instagram, Send, Globe, Music,
  ShieldCheck, Heart, Video, Share2,
  Megaphone, Target, Palette, Code, Settings, Bell,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface PlatformConfig {
  slug: string;
  name: string;
  i18n: string; // prefix for translation keys: wp, ig, ms, tt, ww
  color: string;
  colorAlt: string;
  hslPrimary: string;
  hslAccent: string;
  icon: LucideIcon;
  badgeIcon: LucideIcon;
  featureIcons: LucideIcon[];
  statValues: string[];
}

export const platforms: Record<string, PlatformConfig> = {
  whatsapp: {
    slug: "whatsapp", name: "WhatsApp", i18n: "wp",
    color: "#25D366", colorAlt: "#128C7E",
    hslPrimary: "152 69% 41%", hslAccent: "168 45% 33%",
    icon: MessageCircle, badgeIcon: ShieldCheck,
    featureIcons: [Bot, Clock, Shield, BarChart3, Zap, Users, CreditCard, Database, Contact],
    statValues: ["5 min", "98%", "24/7"],
  },
  instagram: {
    slug: "instagram", name: "Instagram", i18n: "ig",
    color: "#E1306C", colorAlt: "#C13584",
    hslPrimary: "340 74% 54%", hslAccent: "326 58% 49%",
    icon: Instagram, badgeIcon: ShieldCheck,
    featureIcons: [Bot, Heart, Megaphone, BarChart3, Zap, Users, Megaphone, Database, Contact],
    statValues: ["3x", "80%", "24/7"],
  },
  messenger: {
    slug: "messenger", name: "Messenger", i18n: "ms",
    color: "#0084FF", colorAlt: "#006ACD",
    hslPrimary: "211 100% 50%", hslAccent: "211 100% 40%",
    icon: Send, badgeIcon: ShieldCheck,
    featureIcons: [Bot, Clock, Shield, BarChart3, Zap, Users, Share2, Database, Contact],
    statValues: ["<3s", "95%", "24/7"],
  },
  tiktok: {
    slug: "tiktok", name: "TikTok", i18n: "tt",
    color: "#FF0050", colorAlt: "#00F2EA",
    hslPrimary: "341 100% 50%", hslAccent: "177 100% 47%",
    icon: Music, badgeIcon: ShieldCheck,
    featureIcons: [Bot, Video, Target, BarChart3, Zap, Users, Megaphone, Database, Contact],
    statValues: ["5x", "70%", "24/7"],
  },
  wordpress: {
    slug: "wordpress", name: "WordPress", i18n: "ww",
    color: "#21759B", colorAlt: "#1A5F7A",
    hslPrimary: "197 65% 37%", hslAccent: "197 64% 29%",
    icon: Globe, badgeIcon: ShieldCheck,
    featureIcons: [Bot, Code, Palette, BarChart3, Zap, Settings, Bell, Database, Contact],
    statValues: ["1 clic", "40%", "24/7"],
  },
};

export const platformList = Object.values(platforms);
export const platformSlugs = Object.keys(platforms);
