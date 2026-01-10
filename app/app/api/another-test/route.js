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

export async function POST(request) {
  try {
    const { input } = await request.json()
    
    if (!input || input.trim() === '') {
      return Response.json({ error: '输入内容不能为空' }, { status: 400 })
    }
    
    // 1. 原始输入请求API
    const originalResponse = await callAIAPI(input)
    
    // 2. 处理输入内容：开头增加"要实事求是，"，结尾增加"给出的数据或者案例要有出处，不能胡编"
    const processedInput = `要实事求是，${input}给出的数据或者案例要有出处，不能胡编`
    
    // 3. 新输入请求API
    const processedResponse = await callAIAPI(processedInput)
    
    return Response.json({ 
      success: true,
      originalInput: input,
      originalOutput: originalResponse,
      processedInput: processedInput,
      processedOutput: processedResponse
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