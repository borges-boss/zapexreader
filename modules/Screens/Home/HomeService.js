const HomeService = {
  getBarcodeByMapCode: function (code) {
    //26255
    let url =
      'https://api.occult.com.br/emissao/itensRomaneio/OCCULT/' +
      code;
    
    return fetch(url, {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then(res => res.json())
      .then(function (json) {
        return json;
      })
      .catch(error => {
        console.log(error);
        return undefined;
      });
  },
};

export default HomeService;
