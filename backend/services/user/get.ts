import { Admin } from '../../models/admin'
import { Agent } from '../../models/agent'
import { Tourist } from '../../models/tourist'
import _ from 'lodash'

const findByParams = async (params, useAllParams?: boolean) => {
  params = _.omitBy(params, _.isNil)
  const preparedParams = []
  
  Object.entries(params).forEach(([key, value]) => {
    preparedParams.push({
      [key]: value
    })
  })
  
  const filter = useAllParams ? '$and' : '$or'
  
  const admins = await Admin.find({ [filter]: preparedParams })
  const agents = await Agent.find({ [filter]: preparedParams })
  const tourists = await Tourist.find({ [filter]: preparedParams })
  let returnVal: Record<string, any> = {
    isExist: false,
    existType: null
  }
  
  if (admins.length) {
    returnVal.existType = 'admin'
    returnVal.info = admins[0]
  }
  if (agents.length) {
    returnVal.existType = 'agent'
    returnVal.info = agents[0]
  }
  if (tourists.length) {
    returnVal.existType = 'tourist'
    returnVal.info = tourists[0]
  }
  
  returnVal.isExist = Boolean(returnVal.existType)
  
  
  return returnVal
}

export default {
  findByParams
}
