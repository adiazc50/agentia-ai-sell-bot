import es from "./es";
import en from "./en";
import pt from "./pt";
import fr from "./fr";
import de from "./de";

export type Language = "es" | "en" | "pt" | "fr" | "de";

export interface LanguageInfo {
  code: Language;
  flag: string;
  label: string;
  nativeLabel: string;
}

export const languages: LanguageInfo[] = [
  { code: "es", flag: "🇪🇸", label: "Spanish", nativeLabel: "Español" },
  { code: "en", flag: "🇺🇸", label: "English", nativeLabel: "English" },
  { code: "pt", flag: "🇧🇷", label: "Portuguese", nativeLabel: "Português" },
  { code: "fr", flag: "🇫🇷", label: "French", nativeLabel: "Français" },
  { code: "de", flag: "🇩🇪", label: "German", nativeLabel: "Deutsch" },
];

export const translations: Record<Language, Record<string, string>> = {
  es,
  en,
  pt,
  fr,
  de,
};
