import { useState } from 'react'

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <button className='border border-[#ffffff41] p-2 rounded-lg' onPointerMove={() => setCount((count) => count + 1)}>
                count is {count}
            </button>
        </>
    )
}

export default App
