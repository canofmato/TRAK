export const convertIfHeic = async (file: File): Promise<File> => {
  const isHeic =
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    file.type === '' ||
    file.name.toLowerCase().endsWith('.heic') ||
    file.name.toLowerCase().endsWith('.heif')

  if (!isHeic) return file

  try {
    // ✅ 방법 1: heic2any
    const { default: heic2any } = await import("heic2any")
    const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.8 })
    const blob = Array.isArray(converted) ? converted[0] : converted
    return new File(
      [blob],
      file.name.replace(/\.(heic|heif)$/i, '.jpg'),
      { type: 'image/jpeg' }
    )
  } catch {
    try {
      // ✅ 방법 2: browser-image-compression (HEIC 자동 변환 지원)
      const { default: imageCompression } = await import("browser-image-compression")
      const compressed = await imageCompression(file, {
        maxSizeMB: 5,
        fileType: 'image/jpeg',
        useWebWorker: true,
      })
      return new File(
        [compressed],
        file.name.replace(/\.(heic|heif)$/i, '.jpg'),
        { type: 'image/jpeg' }
      )
    } catch (error) {
      console.warn('HEIC 변환 실패:', error)
      if (typeof window !== 'undefined') {
        window.alert('이 HEIC 파일은 지원되지 않아요. JPG나 PNG로 변환 후 업로드해주세요.')
      }
      return file
    }
  }
}
