const HomeService = {
    getBarcodeByMapCode:function(code){
        //26255
        let url = "https://api.zapex.com.br/emissao/itensRomaneio/2LAVUNBOG3TH3HNMND6JC9IKJPC1BY/"+code;
        return fetch(url)
        .then(res => res.json())
        .then(function(json){
            return json
        });
    }
}


export default HomeService;