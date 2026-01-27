import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Math7 Admin Panel
        </h1>
        <p className="text-gray-600 mb-8">
          Phase 0: Project Bootstrap Complete
        </p>
        <button
          onClick={() => setCount((count) => count + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Count is {count}
        </button>
      </div>
    </div>
  )
}

export default App
