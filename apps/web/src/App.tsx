import { useState } from 'react'
import { MainLayout } from './components'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Logistics CRM MVP
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Welcome to your CRM application
          </p>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <button 
              onClick={() => setCount((count) => count + 1)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              count is {count}
            </button>
          </div>
        </header>
      </div>
    </MainLayout>
  )
}

export default App