import getUserService from '~~/backend/services/user/get'
import _ from 'lodash'


export const isAccountExist = async (req, res) => {
  try {
    
    const {
      email,
      phone,
      password
    } = req.query
    
    const account = await getUserService.findByParams({ email, phone, password }, true)
    
    res.status(200)
      .json(account)
  } catch
    (e) {
    res.status(500)
      .json(e.message)
  }
}

export default {
  isAccountExist,
}
