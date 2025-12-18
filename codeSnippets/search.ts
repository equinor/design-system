export const basicSearch = `const [searchQuery, setSearchQuery] = useState("");

<Search
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Search..."
/>

{searchQuery.length > 0 && (
  <Typography>Searching for: {searchQuery}</Typography>
)}`;

export const cancellableSearch = `const [searchQuery, setSearchQuery] = useState("");

<Search
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Search with cancel..."
  cancellable
  onCancelPress={() => setSearchQuery("")}
/>

{searchQuery.length > 0 && (
  <Typography>Searching for: {searchQuery}</Typography>
)}`;
