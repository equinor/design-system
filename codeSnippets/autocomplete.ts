export const singleSelectAutocomplete = `const countries = [
  { label: "Norway", value: "no" },
  { label: "Sweden", value: "se" },
  { label: "Denmark", value: "dk" },
];

type Country = { label: string; value: string };

const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(undefined);

<Autocomplete
  label="Select a country"
  placeholder="Search countries..."
  options={countries}
  selectedOption={selectedCountry}
  onSelect={setSelectedCountry}
  transformItem={(item) => item.label}
/>

{selectedCountry && (
  <Typography>
    Selected: {selectedCountry.label}
  </Typography>
)}`;

export const multiSelectAutocomplete = `const countries = [
  { label: "Norway", value: "no" },
  { label: "Sweden", value: "se" },
  { label: "Denmark", value: "dk" },
];

type Country = { label: string; value: string };

const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);

<Autocomplete.Multiselect
  label="Select countries"
  placeholder="Search countries..."
  options={countries}
  selectedOptions={selectedCountries}
  onSelect={setSelectedCountries}
  transformItem={(item) => item.label}
/>

{selectedCountries.length > 0 && (
  <Typography>
    Selected: {selectedCountries.map((c) => c.label).join(", ")}
  </Typography>
)}`;
