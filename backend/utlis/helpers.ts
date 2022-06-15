export const getRealImagePath = (
  req: Record<string, any>,
  img: Record<string, any>
): string => {
  return `./_nuxt/images/tours/${ img.filename }`
}
