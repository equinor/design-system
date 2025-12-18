export const basicMenu = `const [menuOpen, setMenuOpen] = useState(false);
const anchorRef = useRef<View>(null);

<View ref={anchorRef}>
  <Button 
    title="Open Menu" 
    onPress={() => setMenuOpen(true)} 
  />
</View>

<Menu
  anchorEl={anchorRef}
  open={menuOpen}
  onClose={() => setMenuOpen(false)}
>
  <Menu.Item 
    onPress={() => setMenuOpen(false)} 
    title="Option 1" 
  />
  <Menu.Item 
    onPress={() => setMenuOpen(false)} 
    title="Option 2" 
  />
  <Menu.Item 
    onPress={() => setMenuOpen(false)} 
    title="Option 3" 
  />
</Menu>`;

export const menuWithIcons = `const [menuOpen, setMenuOpen] = useState(false);
const anchorRef = useRef<View>(null);

<View ref={anchorRef}>
  <Button 
    title="Open Menu" 
    onPress={() => setMenuOpen(true)} 
  />
</View>

<Menu
  anchorEl={anchorRef}
  open={menuOpen}
  onClose={() => setMenuOpen(false)}
>
  <Menu.Item
    onPress={() => setMenuOpen(false)}
    title="Profile"
    iconName="face-man"
  />
  <Menu.Item
    onPress={() => setMenuOpen(false)}
    title="Delete"
    iconName="delete"
  />
  <Menu.Item
    onPress={() => setMenuOpen(false)}
    title="Share"
    iconName="share"
  />
  <Menu.Item 
    title="Disabled" 
    disabled 
  />
  <Menu.Item 
    title="Active item" 
    active 
  />
</Menu>`;
