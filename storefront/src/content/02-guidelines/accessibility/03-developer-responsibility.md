# Developer responsibility

Accessibility is the responsibility of the entire project - designers and developers have expanded responsibilites.

Accessibility is about following good standards and anticipating user's needs. The EDS delivers accessiblity compliant components, however, there are some things for you to remember as your combine components.

These hands-on tips will hopefully improve both accessibility compliance and user experience in general.

## Code structure

Screen readers are not common in Equinor, but keyboard only may the case for some users in some situations. Make sure you structure the code with a good tab flow hierarchy in mind. A good best practice is header, main navigation, page navigation and finally footer.

## Semantic HTML

Try to use native HTML elements when you can, they give you some free, built-in accessibility. 

## TH table headers

Use the <th> tag when in tables

## Alternative texts

If an image has a certain meaning and is not only for decorative puproses, it has to have a meaningful alternative text. If it is decorative in its nature, add an empty alt tag.

## Define the language

Make sure you define the language by utilising the HTML tag; <html lang="en">.

## Validating your work

There are several resources available when you are going to validate your work, here are the ones we find valuable:
* [Wave toolbar browser extension](http://wave.webaim.org/extension)
* [HTML5 validator](https://html5.validator.nu/)
* [Accessibility Developer Tools for Chrome](https://chrome.google.com/webstore/detail/accessibility-developer-t/fpkknkljclfencbdbgkenhalefipecmb)
* Turn off CSS in the browser and check that the order of elements make sense

## Other resources and tools

* [IBM Accessibility Checklist](https://www.ibm.com/able/guidelines/ci162/accessibility_checklist.html)
* [Accessibility Requirements for People with Lov Vision]( https://www.w3.org/TR/low-vision-needs/)
* [WebAIM, provider of accessibilty expertise)]( https://webaim.org/)
* [The A11Y Project, accessibility community]( https://a11yproject.com/)
* [AreMyColoursAccessible.com]( https://www.aremycoloursaccessible.com/)

These tools are all great for testing to some extent. However, we do recommend that you test with real users if you can.



_____

## Keyboard navigation

Not all users have access to mouse, and are therefore relying on keyboard or screenreader. Try navigating your own solution by only using keyboard. Can you naviagate? Can you perform all the important tasks? Can you tell where the keyboard focus is? Complying for keyboard only is not hard, but it does require a certain mindset. Try it!


### Focus management

Do your items follow the order you think? Generally, focus travels up to down, and left to right. Follow it by tabbing.


### Tooltips

It is possible to turn on tooltips so that they display on keyboard focus. Very useful.


### Form validating inline

Make sure you drop form validation feedback inline so that users don't have to "travel" far to see it. Keep feedback short and to the point.


## Text and its meaning

Text can be both visible and invisible (alt texts). Make sure all text is meaningful in its context.

### Images with information

If you put information into the image, it is vital to add an alt text that explains. Again, keep it short if you can, but make sure it is understood. If the surrounding text gives a good context, you might need less.

### Videos

Videos are tricky, make sure you have some sort of transcript of the content. Make sure users can stop and start. 

