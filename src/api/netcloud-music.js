// 接口成功返回了，但是没有用，真正的CDN地址，它也有跨域限制？非audio拿不到
import axios from 'axios'

async function fetchFinalMusicUrl(originalUrl) {
  try {
    // 使用正则表达式从原始URL中提取ID
    const match = originalUrl.match(/id=(\d+)/)
    if (!match || !match[1]) {
      throw new Error('Invalid URL format.')
    }

    const songId = match[1]

    // 调用你创建的 API 接口
    const response = await axios.get(`https://www.toori.top/get-final-url`, {
      params: {
        song_id: songId
      }
    })

    if (response.status === 200 && response.data.final_url) {
      return response.data.final_url
    } else {
      throw new Error('Failed to retrieve the final URL.')
    }
  } catch (error) {
    console.error('Error fetching the final music URL:', error)
    return null
  }
}

export { fetchFinalMusicUrl }
