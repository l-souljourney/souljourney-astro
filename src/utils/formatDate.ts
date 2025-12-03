/**
 * Format date for i18n display
 * @param date - Date object or string
 * @param lang - Language code ('zh' or 'en')
 * @param format - Format type ('full' or 'short')
 * @returns Formatted date string
 */
export function formatDate(
    date: Date | string,
    lang: 'zh' | 'en',
    format: 'full' | 'short' = 'full'
): string {
    const d = typeof date === 'string' ? new Date(date) : date;

    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();

    if (lang === 'zh') {
        // 中文格式
        return format === 'full'
            ? `${year}年${month.toString().padStart(2, '0')}月${day.toString().padStart(2, '0')}日`
            : `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    } else {
        // 英文格式
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        if (format === 'full') {
            return `${monthsFull[month - 1]} ${day}, ${year}`;
        } else {
            return `${months[month - 1]} ${day}, ${year}`;
        }
    }
}
