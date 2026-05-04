export const basicDialog = `const [dialogOpen, setDialogOpen] = useState(false);

<Button
  label="Open Dialog"
  onPress={() => setDialogOpen(true)}
/>

<Dialog
  isOpen={dialogOpen}
  onScrimPress={() => setDialogOpen(false)}
>
  <Dialog.Header>Dialog Title</Dialog.Header>
  <Dialog.CustomContent>
    <Typography>
      This is the dialog content. You can add any content here.
    </Typography>
  </Dialog.CustomContent>
</Dialog>`;

export const dialogWithActions = `const [dialogOpen, setDialogOpen] = useState(false);

<Button
  label="Open Dialog"
  onPress={() => setDialogOpen(true)}
/>

<Dialog
  isOpen={dialogOpen}
  onScrimPress={() => setDialogOpen(false)}
>
  <Dialog.Header>Confirm Action</Dialog.Header>
  <Dialog.CustomContent>
    <Typography>
      Are you sure you want to proceed with this action?
    </Typography>
  </Dialog.CustomContent>
  <Dialog.Actions>
    <Button
      label="Cancel"
      variant="ghost"
      onPress={() => setDialogOpen(false)}
    />
    <Button
      label="Confirm"
      onPress={() => {
        console.log("Confirmed!");
        setDialogOpen(false);
      }}
    />
  </Dialog.Actions>
</Dialog>`;
