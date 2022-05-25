const dailyDate = ({ date }) => {
    const oriDate = new Date(date)
    const currentDate = new Date()

    if (
        oriDate.getDay() == currentDate.getDay() &&
        oriDate.getMonth() == currentDate.getMonth() &&
        oriDate.getFullYear() == currentDate.getFullYear()
    ) return true
    return false
}

exports.dailyDate = dailyDate