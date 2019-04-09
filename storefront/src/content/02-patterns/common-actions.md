# Common actions

Some action will be used several times and across components and workflows. To make sure that we are consistent, such actions should only be applied as described below.

## Regressive actions

### Cancel

Cancel will stop the ongoing action and close the component in question. Always warn the user of any negative consequences of doing this (typically loss of data).

Always use a secondary button or a link.

### Clear

Clears data from a form field or remove selections. For radio buttons, Clear will set the controls back to the default selection.

Use the X icon inside the field or just next to the item/value in question.

### Delete

This refers to deleting and existing object. Delete is a permanent action and users must be made aware of this and that it might be very difficult/impossible to undo.

Use a warning button or a secondary button if button is relevant, otherwise use warning colours. Whenever sensible, make the user confirm the deletion. 

### Remove

This refers to the removal of an item from a list. Never use Remove when permanently deleting an object of any kind.

Use a button or the proper remove icone.

### Reset

Set system values and filters back to the last saved state. Typically back to the last time users clicked "Apply".

Use link. 

## Progressive actions

### Add


Add objects to a list or a set.

Use primary button or a button with an icon.

### Copy

Copies and creates an identical instance of the object in question.

Use designated Copy icon and show a confirmation either by tooltip or by xxxx

### Edit

Allow the users to change the value of an object.

Use either as an option in a menu, a button or with designated Edit icon.

### Next

Advances user to the next step in a stepper, typically a wizard.

Use either a button or the forward icon.



Martin, ref: https://www.carbondesignsystem.com/patterns/common-actions