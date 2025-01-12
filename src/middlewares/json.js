export async function json(req, res) {
    const buffers = []
  
    for await (const chunk of req) {
      buffers.push(chunk)
    }
    
    const rawBody = Buffer.concat(buffers).toString();
    try {
      req.body = JSON.parse(rawBody);
    } catch {
      req.body = null
    }
  
    res.setHeader('Content-type', 'application/json')
  }