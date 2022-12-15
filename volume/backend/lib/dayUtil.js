const dayUtil = {
  getTodayWorkTime(date) {
    const today = new Date(date);
    // Date.setXXXX()는 원본이 바뀌는 메소드이기 때문에 각각 이렇게 세팅해준다.
    const startDate = new Date(today.setHours(6, 0, 0, 0));
    const endDate = new Date(today.setDate(today.getDate() + 1));

    return { startDate, endDate };
  },
};
module.exports = dayUtil;
