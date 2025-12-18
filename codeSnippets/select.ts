export const basicSelect = `type Fruit = {
  id: string;
  name: string;
};

const fruits = [
  { title: "Apple", value: { id: "1", name: "Apple" } },
  { title: "Banana", value: { id: "2", name: "Banana" } },
  { title: "Orange", value: { id: "3", name: "Orange" } },
];

const [selectedFruit, setSelectedFruit] = useState<Fruit | undefined>();

<Select
  items={fruits}
  selectedItem={selectedFruit}
  onSelect={setSelectedFruit}
  placeholder="Select a fruit"
/>

{selectedFruit && (
  <Typography>Selected: {selectedFruit.name}</Typography>
)}`;

export const multiSelect = `const countries = [
  { title: "Norway", value: "Norway" },
  { title: "United States", value: "United States" },
  { title: "Germany", value: "Germany" },
];

const [selectedItems, setSelectedItems] = useState<string[]>([]);

<Select.Multi
  placeholder="Select countries..."
  items={countries}
  selectedItems={selectedItems}
  onSelect={setSelectedItems}
/>

{selectedItems.length > 0 && (
  <Typography>Selected: {selectedItems.join(", ")}</Typography>
)}`;
