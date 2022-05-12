import getAdminService from '~~/backend/services/admin/get'

export const findById = async (req, res) => {
  try {
    res.status(200)
      .json((await getAdminService.findById(req.params.id)))
  } catch (e) {
    res.status(500)
      .json(e.message)
  }
}

export default {
  findById,
}
