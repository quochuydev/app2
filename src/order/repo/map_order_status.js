const MapOrderStatus = {
  convertHrvStatus(hrvStatus) {
    switch (hrvStatus) {
      case 'complete':
        return 'complete';
      default:
        return '';
    }
  },
  convertWooStatus(wooStatus) {
    switch (wooStatus) {
      case 'complete':
        return 'complete';
      default:
        return '';
    }
  }
}

module.exports = MapOrderStatus;
