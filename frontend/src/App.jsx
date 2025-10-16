import React, { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold mb-4">Tailwind + Vite + React</h1>
        <div className="bg-white rounded-lg shadow p-4 space-y-4">
          <p className="text-sm text-gray-600">If you see this styled box, Tailwind is working.</p>
          <button
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setCount((c) => c + 1)}
          >
            Count is {count}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
