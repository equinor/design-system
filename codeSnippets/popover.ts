export const basicPopover = `const [popoverOpen, setPopoverOpen] = useState(false);
const anchorRef = useRef<View>(null);

<View ref={anchorRef}>
  <Button
    label="Show Popover"
    onPress={() => setPopoverOpen(true)}
  />
</View>

<Popover
  anchorEl={anchorRef}
  open={popoverOpen}
  onClose={() => setPopoverOpen(false)}
>
  <View style={{ padding: 16 }}>
    <Typography>This is a popover!</Typography>
    <Typography>
      Popovers are great for displaying additional information.
    </Typography>
  </View>
</Popover>`;

export const popoverWithActions = `const [popoverOpen, setPopoverOpen] = useState(false);
const anchorRef = useRef<View>(null);

<View ref={anchorRef}>
  <Button
    label="Show Popover with Actions"
    onPress={() => setPopoverOpen(true)}
  />
</View>

<Popover
  anchorEl={anchorRef}
  open={popoverOpen}
  onClose={() => setPopoverOpen(false)}
  placement="top" // or "bottom", "left", "right"
>
  <View style={{ padding: 16, gap: 12 }}>
    <Typography weight="bolder">Quick Actions</Typography>
    <Typography>
      You can add any content inside a popover, including
      buttons and interactive elements.
    </Typography>
    <Button
      label="Close"
      onPress={() => setPopoverOpen(false)}
      variant="secondary"
    />
  </View>
</Popover>`;
