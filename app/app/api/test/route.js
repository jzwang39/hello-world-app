// 调用第三方AI API的辅助函数
async function callAIAPI(inputText) {
  const requestBody = {
    model: "claude-sonnet-4-5-20250929-thinking",
    messages: [
      {
        role: "user",
        content: inputText
      }
    ],
    max_tokens: 200000
  }
  
  // 设置超时控制器（600秒）
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 600000)
  
  // 调用第三方API
  const response = await fetch('https://yunwu.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'sk-k4D3EzasLXFteUmhSZFIwY8HWnZoKdB5lqSlzf0oa7tqQscF',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody),
    signal: controller.signal
  })
  
  clearTimeout(timeoutId)
  
  if (!response.ok) {
    throw new Error(`第三方API请求失败: ${response.status}`)
  }
  
  const data = await response.json()
  
  // 提取AI回复内容
  return data.choices?.[0]?.message?.content || '未收到有效回复'
}

export async function GET() {
  return Response.json({ 
    message: 'Hello from API Test 1!',
    endpoint: '/api/test',
    method: 'GET',
    usage: 'Send POST request with { "input": "your text" } to call AI API'
  })
}

export async function POST(request) {
  try {
    const { input } = await request.json()
    
    if (!input || input.trim() === '') {
      return Response.json({ error: '输入内容不能为空' }, { status: 400 })
    }
    
    // 直接使用原始输入调用API
    const aiResponse = await callAIAPI(input)
    
    return Response.json({ 
      success: true,
      input: input,
      output: aiResponse
    })
    
  } catch (error) {
    if (error.name === 'AbortError') {
      return Response.json({ error: '请求超时（600秒）' }, { status: 408 })
    }
    
    console.error('API调用错误:', error)
    return Response.json({ 
      error: error.message || '服务器内部错误' 
    }, { status: 500 })
  }
}