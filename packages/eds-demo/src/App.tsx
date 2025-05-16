import '@equinor/eds-tokens/css/demo/selectable.css'
import './App.css'
import './Box.css'

function App() {
  return (
    <article className="text-left">
      <h2 className="text-4xl mb-10">Selectable spacing</h2>
      <section className="grid gap-14">
        <div data-ratio="squared">
          <h3 className="text-2xl mb-4">Squared</h3>
          <div className="flex items-end align-item gap-4">
            <div className="box flex-none" data-padding="xs">
              <div className="box__inner">xs</div>
            </div>
            <div className="box flex-none" data-padding="sm">
              <div className="box__inner">sm</div>
            </div>
            <div className="box flex-none" data-padding="md">
              <div className="box__inner">md</div>
            </div>
          </div>
        </div>
        <div data-ratio="stretched">
          <h3 className="text-2xl mb-4">Stretched</h3>
          <div className="flex items-end align-item gap-4">
            <div className="box" data-padding="xs">
              <div className="box__inner">xs</div>
            </div>
            <div className="box" data-padding="sm">
              <div className="box__inner">sm</div>
            </div>
            <div className="box" data-padding="md">
              <div className="box__inner">md</div>
            </div>
          </div>
        </div>
        <div data-ratio="squished">
          <h3 className="text-2xl mb-4">Squished</h3>
          <div className="flex items-end align-item gap-4">
            <div className="box" data-padding="xs">
              <div className="box__inner">xs</div>
            </div>
            <div className="box" data-padding="sm">
              <div className="box__inner">sm</div>
            </div>
            <div className="box" data-padding="md">
              <div className="box__inner">md</div>
            </div>
          </div>
        </div>
      </section>
    </article>
  )
}

export default App
