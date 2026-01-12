'use client'

import { useState } from 'react'

export default function Home() {
  const [inputText, setInputText] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  // 处理逻辑：调用第三方AI API
  const handleProcess = async () => {
    if (!inputText.trim()) {
      setResult('请输入文本内容')
      return
    }
    
    setLoading(true)
    setResult('')
    
    try {
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: inputText }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setResult(`AI回复：${data.output}`)
      } else {
        setResult(`错误：${data.error}`)
      }
    } catch (error) {
      setResult(`请求失败：${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 md:p-24">
      <div className="z-10 max-w-4xl w-full">
        {/* 文本框和按钮组合 */}
        <div className="mb-6">
          <label htmlFor="textInput" className="block text-lg font-medium mb-2">
            请输入文本：
          </label>
          <div className="relative">
            <textarea
              id="textInput"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="在这里输入您要处理的文本..."
              className="w-full h-32 p-4 pr-32 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            {/* 按钮放在右下角 */}
            <div className="absolute bottom-3 right-3">
              <button
                onClick={handleProcess}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-2 px-6 rounded-lg transition-colors text-base"
              >
                {loading ? '处理中...' : '处理'}
              </button>
            </div>
          </div>
        </div>
        
        {/* 结果显示区域 */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-4">处理结果</h3>
          <div className="min-h-40 p-4 bg-white border rounded">
            {result || '等待处理...'}
          </div>
        </div>
      </div>
    </main>
  )
}