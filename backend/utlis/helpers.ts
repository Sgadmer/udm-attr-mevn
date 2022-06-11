export const getRealImagePath = (
  req: Record<string, any>,
  img: Record<string, any>
): string => {
  return `${ req.protocol }://${ req.get('host') }/images/tours/${ img.filename }`
}
