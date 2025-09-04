const currentDate = new Date();

export const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",]

export const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
export const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
export const firstDayWeekday = firstDayOfMonth.getDay()
export const daysInMonth = lastDayOfMonth.getDate()

export const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0)
export const daysInPrevMonth = prevMonth.getDate()
