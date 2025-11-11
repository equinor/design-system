import styled from 'styled-components'

// Constants
export const SAMPLE_TEXT = 'The quick brown fox jumps over the lazy dog'

export const GridBackground = styled.div`
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent 3px,
    rgba(255, 0, 0, 0.1) 3px,
    rgba(255, 0, 0, 0.1) 4px
  );
  padding: 24px;

  /* Debug mode styling for text elements */
  [data-debug] {
    background: color-mix(in oklch, limegreen, transparent 84%);
  }
`
