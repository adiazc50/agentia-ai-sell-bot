import { countries as latinCountries, CountryData, CityData } from "./seoCountries";
import { extraCountries } from "./seoSpainCaribbean";

export type { CountryData, CityData };

export const allCountries: CountryData[] = [...latinCountries, ...extraCountries];

export const getCountryBySlug = (slug: string): CountryData | undefined =>
  allCountries.find(c => c.slug === slug);

export const getCityBySlug = (countrySlug: string, citySlug: string): CityData | undefined => {
  const country = getCountryBySlug(countrySlug);
  return country?.cities.find(c => c.slug === citySlug);
};
