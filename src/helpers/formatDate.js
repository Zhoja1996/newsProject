const formatDate = (date) => {
    const options = {
        weekday: 'long',
        year: 'numeric',
        mouth: 'long',
        day: 'numeric'
    }
    return date.toLocaleDateString('en-US', options);
}

export default formatDate;