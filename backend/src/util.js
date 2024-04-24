function generateDateList(startDate, prev, next){
    const dateList = [];
    const currentDate = new Date(startDate);

    
    for (let i = prev; i >= 1; i--) {
      const prevDate = new Date(currentDate);
      prevDate.setDate(prevDate.getDate() - i);
      dateList.push(formatDate(prevDate));
    }

    dateList.push(formatDate(currentDate));
    
    for (let i = 1; i <= next; i++) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + i);
      dateList.push(formatDate(nextDate));
    }
  
    return dateList;
}
  
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function constructDocument(data) {
    const document = {};
    
    Object.keys(data).forEach(key => {
        if (typeof data[key] === 'object') {
            document[key] = constructDocument(data[key]);
        } 
        else {
            document[key] = data[key];
        }
    });
    return document;
}

module.exports = {
    formatDate,
    generateDateList,
    constructDocument
};