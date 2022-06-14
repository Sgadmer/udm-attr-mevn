export const getRealImagePath = (
  req: Record<string, any>,
  img: Record<string, any>
): string => {
  return `/images/tours/${ img.filename }`
}
