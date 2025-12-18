export const basicDialog = `const [dialogOpen, setDialogOpen] = useState(false);

<Button 
  title="Open Dialog" 
  onPress={() => setDialogOpen(true)} 
/>

<Dialog 
  isOpen={dialogOpen} 
  onScrimPress={() => setDialogOpen(false)}
>
  <Dialog.Header>Dialog Title</Dialog.Header>
  <Dialog.CustomContent>
    <Typography variant="p">
      This is the dialog content. You can add any content here.
    </Typography>
  </Dialog.CustomContent>
</Dialog>`;

export const dialogWithActions = `const [dialogOpen, setDialogOpen] = useState(false);

<Button 
  title="Open Dialog" 
  onPress={() => setDialogOpen(true)} 
/>

<Dialog 
  isOpen={dialogOpen} 
  onScrimPress={() => setDialogOpen(false)}
>
  <Dialog.Header>Confirm Action</Dialog.Header>
  <Dialog.CustomContent>
    <Typography variant="p">
      Are you sure you want to proceed with this action?
    </Typography>
  </Dialog.CustomContent>
  <Dialog.Actions>
    <Button
      title="Cancel"
      variant="ghost"
      onPress={() => setDialogOpen(false)}
    />
    <Button
      title="Confirm"
      onPress={() => {
        console.log("Confirmed!");
        setDialogOpen(false);
      }}
    />
  </Dialog.Actions>
</Dialog>`;
