# Video Tutorials

Welcome to our friendly walkthroughs designed for both designers and developers! Each series consists of four bite-sized videos (~2–2.5 minutes each), making it easy to learn at your own pace. Total runtime per series: ~9 minutes.

These tutorials use our current color system vocabulary from the colour foundation docs (`about.md`, `getting-started.md`). The script works with the static and dynamic implementation strategy:

---

## Design Series

### Video 1: UI Layers & Global Text (~2–2.5 min)

**Intro (0:00–0:15)**  
Let's explore how to create beautiful visual hierarchy in our UI! We'll use canvas, surface, and floating background variables to organize the design. Plus, we'll set up the perfect default text color to make everything look polished.

**Figma Walkthrough (0:15–1:50)**

- Start by selecting our Dashboard frame and applying the canvas colour
- Next, choose our top bar, sidebar, and table elements to apply the surface treatment
- Now select our menu and apply the floating colour for that elevated look
- Finally, select our text elements to set up the default text color

**Quick Recap (1:50–2:30)**  
Perfect! We've now created a clear visual hierarchy using our neutral canvas, surface, and floating concept colors. The best part? All our colors automatically adapt when switching between light and dark modes.

### Video 2: Chip Variants (~2 min)

**Intro (0:00–0:10)**  
Let's create a versatile Chip component that handles all those common system states we need.

**Figma Walkthrough (0:10–1:30)**

- We'll start with this handy base component as our foundation
- Apply a background color using the fill muted variable for that subtle look
- Add text using text subtle – notice how perfectly it pairs with fill muted!
- Now for the fun part: duplicate our chip for info, success, warning, and danger states

**Quick Recap (1:30–2:00)**  
Great! We've just created a complete chip component system that represents different states beautifully. Our color system makes building consistent, stateful components straightforward and reliable.

### Video 3: Tabs & States (~2 min)

**Intro (0:00–0:10)**  
Let's build a Tab component that responds to user interactions!

**Figma Walkthrough (0:10–1:30)**

- **Default state**: Start with Text in Neutral Subtle for that clean, unselected look
- **Hover state**: Add a Background using Fill Muted Default to show it's interactive
- **Selected state**: Switch Text to Accent Subtle to highlight the active tab
- **Selected border**: Add a Border using Accent Strong for that perfect finishing touch

**Quick Recap (1:30–2:00)**
Nice! We now have a polished, interactive tab component with smooth state transitions. Tip: this colour pairing works wonderfully for other interactive components too!

### Video 4: Button Variants & States (~2 min)

**Intro (0:00–0:10)**  
Let's create a complete button system with primary, secondary, and tertiary variants – each with full state support.

**Figma Walkthrough (0:10–1:00)**

- **Primary Button**: Start with the filled style for maximum prominence
  - Build out all the essential states: initial, hover, active, focus, and disabled
- **Secondary Button**: Create the outlined variant for secondary actions
- **Tertiary Button**: Design the text-only version for subtle interactions

**Quick Recap (1:30–2:00)**
Great! We've now built a comprehensive button component system with three distinct variants and complete state coverage.

---

## Developer Series

Ready to bring these designs to life? This series covers the same four concepts with a focus on implementation.

### Video 1: UI Layers & Global Text (~2–2.5 min)

**Intro (0:00–0:15)**  
Let's code up that beautiful visual hierarchy! We'll implement canvas, surface, and floating background variables, plus set up the default text color in our app.

**Code Implementation (0:15–1:50)**

- Start by applying canvas to our Dashboard container
- Add surface styling to our top bar, sidebar, and table components
- Implement floating for our menu to achieve that elevated effect
- Set up default text colors for all our textual elements

**Quick Recap (1:50–2:30)**
Perfect! We've successfully implemented visual hierarchy using our neutral canvas, surface, and floating concept colors. The best part? The code automatically handles light and dark mode transitions.

### Video 2: Chip Variants (~2 min)

**Intro (0:00–0:10)**  
Time to code a Chip component! We'll build support for the essential system states.

**Code Implementation (0:10–1:30)**

- Start with our base component structure as the foundation
- Implement background colors using the fill muted variable for that clean look
- Add text styling with text subtle – notice the perfect pairing with fill muted!
- Create variants for info, success, warning, and danger states
- Code up those interactive states: default, hover, and active

**Quick Recap (1:30–2:00)**  
Great! Our Chip component now handles different system states beautifully. Our color system makes building consistent, stateful components straightforward and reliable.

### Video 3: Tabs & States (~2 min)

**Intro (0:00–0:10)**  
Let's build an interactive Tab component that responds to user interactions!

**Code Implementation (0:10–1:30)**

- **Default state**: Implement Text using Neutral Subtle for the clean, unselected appearance
- **Hover state**: Add Background with Fill Muted Default to show interactivity
- **Selected state**: Switch Text to Accent Subtle to highlight the active tab
- **Selected border**: Apply Border using Accent Strong for that polished finish

**Quick Recap (1:30–2:00)**
Nice! We've built an interactive tab component with proper state management. This color pairing pattern works great for other interactive components too!

### Video 4: Button Variants & States (~2 min)

**Intro (0:00–0:10)**  
Let's code a complete button system with primary, secondary, and tertiary variants – all with full state support!

**Code Implementation (0:10–1:00)**

- **Primary Button**: Build the filled variant for primary actions
  - Implement all essential states: initial, hover, active, focus, and disabled
- **Secondary Button**: Code the outlined version for secondary actions
- **Tertiary Button**: Create the text-only variant for subtle interactions
- Now that we created these variants using the accent colour we will add support for a neutral and danger appearance.

**Quick Recap (1:30–2:00)**
Awesome! We've successfully implemented a comprehensive button system with three distinct variants and complete state coverage. Users will appreciate the consistent, professional interactions throughout the application.
