class Utils {
  static dateFormat(date) {
    return `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  }

  static getDataStorage(keyData) {
    let data = [];
    if (localStorage.getItem(keyData))
      data = JSON.parse(localStorage.getItem(keyData));
    return data;
  }

  static setDataStorage(keyData, data) {
    localStorage.setItem(keyData, JSON.stringify(data));
  }
}
