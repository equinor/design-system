import { ColorSelector, defaultColors } from '../components/ColorSelector'
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'colorlist',
  title: 'Color',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'value',
      type: 'string',
    }),
  ],
  initialValue: {
    title: defaultColors[0].title,
    value: defaultColors[0].value,
  },
  components: {
    input: (props) => {
      return <ColorSelector {...props} />
    },
  },
})
