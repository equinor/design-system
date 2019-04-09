# Designers responsibility

The UI components for all of Equinor's internal products, apps, and web-applications has been built to meet the [WCAG 2.0](https://www.w3.org/TR/WCAG20/) and [Difi.no](https://uu.difi.no) AA level requirments.
While the comonents that are built are accessible, as a designer there are things you need to remember when combining components, creating layouts and prototypes. 

## Spacing

To comply with accessibility guidelines, all interactive components are to have at least 8px between them. This is to prevent users from accidentally clicking the wrong place.

`IMAGE EXAMPLE`


## Order of importance

Place components on the page in order of importance. 
It is vital that all pages are put together in an understandable and prioritised way. 

Try to keep navigation to a minimum of steps and make all steps clear. 

Not all users have access to mouse, and are therefore relying on keyboard or screenreader. 
Try navigating your own solution by only using keyboard. Can you naviagate? Can you perform all the important tasks? Can you tell where the keyboard focus is? 
Complying for keyboard only is not hard, but it does require a certain mindset. Try it!

Do your items follow the order you think? Generally, focus travels up to down, and left to right. Follow it by tabbing.


## Consistent headings

Strive to make your menus and hierarchies consistent. 
Use H1, H2, H3 etc in the correct order. This helps all users navigate and browse the page efficiently.


## Form validating inline

Make sure you drop form validation feedback inline so that users don't have to "travel" far to see it. Keep feedback short and to the point.


## Text and its meaning

Remember that text can be both visible and invisible `alt text`. 
Make sure all text is meaningful in its context.

Keep your line length to no more than 75 charachters per line - this includes spaces. 
This helps with reading flow and avoids uneeded stress on the eyes. 
In the EDS, that means a default paragpah should not be wider tan 660px.  


## Call to actions

Provide descriptive labels - action verbs are good. 

Here is an example: 

Ok: **See all platforms** _Indicates what will happen_  
Not ok: **All platforms** _Does not indicate what will happen_  

If a button's text says "See all platforms", make sure you send the user to a page with all wells. 
Be consistent with how you use verbs and which terms you use. 


## Images

We should all strive to have information as text, but sometimes we have the need for images.

* If you put information into the image, it is vital to add an alt text that explains. 
* Is the image only used for decorative effect and has no real impact? Add a descriptive caption if you can.


## Color

Use the color tokens provided in the EDS. Read more in [Getting Started as a Designer](LINK) for more information on using tokens.

Many users have trouble distuingishing colors from each other, so make sure color is not the only way you convey certain information. 
For example, severity should not be indicated by red color alone.


If you need to use additonal colors for domain specific requirments, charts or graphs make sure to test your colors for contrast. 
Use high contrast, as this is both increases readability in general and includes users with impaired seeing. 
WCAG recommends a ratio of 4.5:1 for standard text and 3:1 for larger text. 

Be very conscious about the contrast of text on a background. 
If the background is an image or is made up of several colours, make sure your text still has a good contrast ratio. 
With responsive design, remember to check how the text floats on its background. 
Consider using a solid background on top of the image.


## Tools and resources

Here are some resources to help you validate your work:  
[WebAIM](https://webaim.org/)   
[Are my colours accessible?](https://www.aremycoloursaccessible.com/)   
[The A11Y Project](https://a11yproject.com/)   

