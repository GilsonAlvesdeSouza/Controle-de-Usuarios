class Utils {
    static dateFormate(date) {
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + (date.getMinutes()<10?'0':'') + date.getMinutes()
    }
}
