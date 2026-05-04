export const basicAccordion = `<Accordion>
  <Accordion.Item title="First Item">
    <Typography>
      This is the content of the first accordion item.
    </Typography>
  </Accordion.Item>

  <Accordion.Item title="Second Item">
    <Typography>
      Content for the second item.
    </Typography>
  </Accordion.Item>

  <Accordion.Item title="Third Item">
    <Typography>
      Content for the third item.
    </Typography>
  </Accordion.Item>
</Accordion>`;

export const accordionDefaultOpen = `<Accordion>
  <Accordion.Item title="Expanded by Default" defaultOpen>
    <Typography>
      This item is expanded by default using the defaultOpen prop.
    </Typography>
  </Accordion.Item>

  <Accordion.Item title="Collapsed by Default">
    <Typography>
      This item is collapsed by default.
    </Typography>
  </Accordion.Item>
</Accordion>`;

export const chevronAndDisabled = `{/* Chevron Position */}
<Accordion>
  <Accordion.Item title="Chevron on Left" chevronPosition="left">
    <Typography>Content with left chevron</Typography>
  </Accordion.Item>

  <Accordion.Item title="Chevron on Right" chevronPosition="right">
    <Typography>Content with right chevron</Typography>
  </Accordion.Item>
</Accordion>

{/* Disabled Accordion */}
<Accordion>
  <Accordion.Item 
    title="This accordion is disabled" 
    disabled
  />
</Accordion>`;
