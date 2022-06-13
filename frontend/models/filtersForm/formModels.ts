export interface IFiltersForm {
  place?: string,
  keywords?: string[],
  priceMin?: number,
  priceMax?: number,
  dateStart?: Date,
  dateEnd?: Date,
}

export interface IFiltersFormAdmin {
  corpName?: string,
  surname?: string,
  name?: string,
  patronymic?: string,
  phone?: string,
  email?: string,
  isBlocked?: boolean,
}
