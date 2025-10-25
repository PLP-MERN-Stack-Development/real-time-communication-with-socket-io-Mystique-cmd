import { useState } from 'react'
import './App.css'

function App() {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')

    const sendMessage = () => {
        if (!input.trim()) return
        setMessages([...messages, input])
        setInput('')
    }

    return (
        <div className="app">
            <h1>🚀 Real-Time Chat (Demo UI)</h1>

            <div className="chat-box">
                {messages.length === 0 && <p>No messages yet...</p>}
                <ul>
                    {messages.map((msg, i) => (
                        <li key={i}>{msg}</li>
                    ))}
                </ul>
            </div>

            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}

export default App
