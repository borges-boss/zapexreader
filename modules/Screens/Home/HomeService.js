const HomeService = {
  getBarcodeByMapCode: function (code) {
    //26255
    let url =
      'https://api.zapex.com.br/emissao/itensRomaneio/2LAVUNBOG3TH3HNMND6JC9IKJPC1BY/' +
      code;
    console.log(url);

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
